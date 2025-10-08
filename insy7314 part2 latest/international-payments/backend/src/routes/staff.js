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
    const result = await pool.query("SELECT * FROM staff WHERE username=$1", [username]);
    const staff = result.rows[0];
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
    console.error("Staff login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// View all payments (staff)
router.get("/payments", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });

  try {
    const payments = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
    res.json(payments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

// Verify payment
router.post("/verify/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });

  try {
    await pool.query("UPDATE payments SET verified=true WHERE id=$1", [req.params.id]);
    res.json({ message: "Payment verified and sent to SWIFT" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying payment", error: err.message });
  }
});

export default router;
