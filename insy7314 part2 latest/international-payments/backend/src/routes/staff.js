// backend/src/routes/staff.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { verifyToken } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Staff login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const p = await pool;
    const result = await p.request()
      .input("username", username)
      .query("SELECT * FROM staff WHERE username=@username");

    const staff = result.recordset[0];
    if (!staff) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, staff.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: staff.id, username: staff.username, role: staff.role || "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Staff login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Get all payments (staff)
router.get("/payments", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });
  try {
    const p = await pool;
    const result = await p.request().query("SELECT * FROM payments ORDER BY created_at DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

// Verify payment
router.post("/verify/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });
  try {
    const p = await pool;
    await p.request()
      .input("id", req.params.id)
      .query("UPDATE payments SET verified=1 WHERE id=@id");
    res.json({ message: "Payment verified and sent to SWIFT" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying payment", error: err.message });
  }
});

export default router;
