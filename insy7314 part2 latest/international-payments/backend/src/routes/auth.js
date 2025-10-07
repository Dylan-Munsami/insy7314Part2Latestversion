import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

/**
 * Ensure default staff user exists.
 * This runs once when the app starts, to guarantee there's a staff login available.
 */
async function ensureDefaultStaff() {
  try {
    const username = "admin";
    const password = "Admin@123";

    const existing = await pool.query("SELECT * FROM staff WHERE username=$1", [username]);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO staff (username, password_hash, role) VALUES ($1, $2, $3)",
        [username, hash, "admin"]
      );
      console.log("✅ Default staff user created: username='admin', password='Admin@123'");
    } else {
      console.log("ℹ️ Default staff user already exists.");
    }
  } catch (err) {
    console.error("Error ensuring default staff:", err.message);
  }
}

// Run once on startup
ensureDefaultStaff();

/**
 * Staff Login
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM staff WHERE username=$1", [username]);
    const staff = result.rows[0];

    if (!staff) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, staff.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: staff.id, username: staff.username, role: staff.role || "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Staff login successful", token });
  } catch (err) {
    console.error("Staff Login Error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

/**
 * Staff View All Payments
 */
router.get("/payments", verifyToken, async (req, res) => {
  try {
    // Optional: Only staff or admin can access
    if (req.user.role !== "staff" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const payments = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
    res.json(payments.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

/**
 * Staff Verify and Forward to SWIFT
 */
router.post("/verify/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "staff" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query("UPDATE payments SET verified = true WHERE id = $1", [req.params.id]);
    res.json({ message: "✅ Payment verified and sent to SWIFT" });
  } catch (err) {
    res.status(500).json({ message: "Error verifying payment", error: err.message });
  }
});

export default router;
