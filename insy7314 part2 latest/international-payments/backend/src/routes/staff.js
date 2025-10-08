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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ message: "Staff login successful" });
  } catch (err) {
    console.error("Staff login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// View all payments (staff)
router.get("/payments", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });

  try {
    const payments = await pool.query("SELECT p.id, p.amount, p.currency, p.provider, p.payee_account, p.swift_code, p.verified, p.created_at, c.full_name, c.account_number FROM payments p JOIN customers c ON p.customer_id = c.id ORDER BY p.created_at DESC");
    res.json(payments.rows);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// Verify payment (staff)
router.post("/verify/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });

  const paymentId = req.params.id;
  try {
    await pool.query("UPDATE payments SET verified=true WHERE id=$1", [paymentId]);
    // Here you would integrate with SWIFT/BACKEND gateway; we stop at 'submit to SWIFT' trigger
    console.log(`Payment ${paymentId} verified by staff ${req.user.username || req.user.id}. Ready to submit to SWIFT.`);
    res.json({ message: "Payment verified and ready for SWIFT submission" });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

export default router;
