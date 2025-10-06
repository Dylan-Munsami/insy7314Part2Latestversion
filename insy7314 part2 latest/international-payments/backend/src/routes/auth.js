import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { validateRegistration, validateLogin } from "../validators/inputValidators.js";

dotenv.config();
const router = express.Router();

// ================== REGISTER ==================
router.post("/register", async (req, res) => {
  const { full_name, id_number, account_number, password } = req.body;

  // Validate input
  if (!validateRegistration(req.body)) {
    return res.status(400).json({ message: "Invalid registration details" });
  }

  try {
    // Check if account already exists
    const existing = await pool.query(
      "SELECT * FROM customers WHERE account_number=$1 OR id_number=$2",
      [account_number, id_number]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Account already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    // Insert new customer
    await pool.query(
      "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1, $2, $3, $4)",
      [full_name, id_number, account_number, hash]
    );

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  const { account_number, password } = req.body;

  // Validate input
  if (!validateLogin(req.body)) {
    return res.status(400).json({ message: "Invalid login details" });
  }

  try {
    // Find user by account number
    const result = await pool.query(
      "SELECT * FROM customers WHERE account_number=$1",
      [account_number]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid account number or password" });
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid account number or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, account_number: user.account_number },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

export default router;
