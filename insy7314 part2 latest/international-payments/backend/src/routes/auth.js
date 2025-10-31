import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Customer login
router.post("/login", async (req, res) => {
  const { account_number, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM customers WHERE account_number=$1", [account_number]);
    const customer = result.rows[0];
    if (!customer) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, customer.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: customer.id, account_number: customer.account_number, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

export default router;
