import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { validateRegistration } from "../validators/inputValidators.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit";

dotenv.config();
const router = express.Router();

// Logging function
function logEvent(message) {
  const logFile = path.join(process.cwd(), "logs/auth.log");
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
}

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later."
});

// Customer registration
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

    const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || "12"));
    await pool.query(
      "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1,$2,$3,$4)",
      [full_name, id_number, account_number, hash]
    );

    logEvent(`New customer registered: ${account_number}`);
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering customer", error: err.message });
  }
});

// Customer login
router.post("/login", loginLimiter, async (req, res) => {
  const { account_number, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM customers WHERE account_number=$1", [account_number]);
    const customer = result.rows[0];

    if (!customer) {
      logEvent(`Failed login attempt: ${account_number}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, customer.password_hash);
    if (!valid) {
      logEvent(`Failed login attempt: ${account_number}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: customer.id, account_number: customer.account_number, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { id: customer.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logEvent(`Customer login success: ${account_number}`);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Refresh token endpoint
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: payload.id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token: accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

export default router;
