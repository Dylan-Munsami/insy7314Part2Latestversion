import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { validateRegistration } from "../validators/inputValidators.js";

dotenv.config();
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { full_name, id_number, account_number, password } = req.body;
  if (!validateRegistration(req.body)) {
    return res.status(400).json({ message: "Invalid registration details" });
  }

  try {
    const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    await pool.query(
      "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1, $2, $3, $4)",
      [full_name, id_number, account_number, hash]
    );
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { account_number, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM customers WHERE account_number=$1", [account_number]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid account number or password" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, account_number: user.account_number }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

export default router;
