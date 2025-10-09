import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ REGISTER CUSTOMER
router.post("/register", async (req, res) => {
  try {
    const { full_name, id_number, account_number, password } = req.body;

    // 1️⃣ Basic input validation
    if (!full_name || !id_number || !account_number || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if customer already exists
    const existing = await pool.query(
      "SELECT * FROM customers WHERE account_number = $1 OR id_number = $2",
      [account_number.trim(), id_number.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Account or ID already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert new customer
    const result = await pool.query(
      "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, full_name, account_number",
      [full_name.trim(), id_number.trim(), account_number.trim(), hashedPassword]
    );

    res.status(201).json({
      message: "Customer registered successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error registering customer:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ LOGIN CUSTOMER
router.post("/login", async (req, res) => {
  try {
    const { account_number, password } = req.body;

    if (!account_number || !password) {
      return res.status(400).json({ message: "Account number and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM customers WHERE account_number = $1",
      [account_number.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const customer = result.rows[0];

    const isValid = await bcrypt.compare(password, customer.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: customer.id, account_number: customer.account_number },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        account_number: customer.account_number,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
