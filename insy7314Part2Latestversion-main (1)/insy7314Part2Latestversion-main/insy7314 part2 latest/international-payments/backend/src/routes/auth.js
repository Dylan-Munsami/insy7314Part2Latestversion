// backend/src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { validateRegistration, sanitizeRegistration } from "../validators/inputValidators.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Customer registration
router.post("/register", async (req, res) => {
  try {
    // Sanitize input
    const sanitizedData = sanitizeRegistration(req.body);

    // Validate sanitized input
    if (!validateRegistration(sanitizedData)) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const { full_name, id_number, account_number, password } = sanitizedData;

    // Check if account or ID already exists
    const existing = await pool.query(
      "SELECT * FROM customers WHERE account_number=$1 OR id_number=$2",
      [account_number, id_number]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Account or ID already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || "12"));

    // Insert new customer
    await pool.query(
      "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1,$2,$3,$4)",
      [full_name, id_number, account_number, hash]
    );

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering customer", error: err.message });
  }
});

// Customer login
router.post("/login", async (req, res) => {
  try {
    const { account_number, password } = req.body;

    // Find customer by account number
    const result = await pool.query("SELECT * FROM customers WHERE account_number=$1", [account_number]);
    const customer = result.rows[0];

    if (!customer) return res.status(401).json({ message: "Invalid credentials" });

    // Compare hashed password
    const valid = await bcrypt.compare(password, customer.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: customer.id, account_number: customer.account_number, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

export default router;
