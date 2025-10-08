// backend/src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { validateRegistration } from "../validators/inputValidators.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Registration (customer)
router.post("/register", async (req, res) => {
  const { full_name, id_number, account_number, password } = req.body;

  if (!validateRegistration(req.body)) {
    return res.status(400).json({ message: "Invalid registration data" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM customers WHERE account_number=$1 OR id_number=$2",
      [account_number, id_number]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Account or ID already exists" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS || "12", 10);
    const hash = await bcrypt.hash(password, saltRounds);
    await pool.query(
      "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1,$2,$3,$4)",
      [full_name, id_number, account_number, hash]
    );

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering customer" });
  }
});

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

    // set secure httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Logout (clears cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  res.json({ message: "Logged out" });
});

export default router;
