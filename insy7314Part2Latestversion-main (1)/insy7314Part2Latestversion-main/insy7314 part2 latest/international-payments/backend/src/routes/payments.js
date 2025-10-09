// backend/src/routes/payments.js
import express from "express";
import { pool } from "../db/db.js";
import { verifyToken } from "../middleware/auth.js";
import { validatePayment, sanitizePayment } from "../validators/inputValidators.js";

const router = express.Router();

// Add payment - customer only
router.post("/", verifyToken, async (req, res) => {
  // Only customers can make payments
  if (req.user.role !== "customer") 
    return res.status(403).json({ message: "Forbidden: customers only" });

  // Sanitize input
  const sanitizedData = sanitizePayment(req.body);

  // Validate input
  if (!validatePayment(sanitizedData)) 
    return res.status(400).json({ message: "Invalid payment data" });

  const { amount, currency, provider, payee_account, swift_code } = sanitizedData;

  try {
    await pool.query(
      `INSERT INTO payments (customer_id, amount, currency, provider, payee_account, swift_code)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.user.id, amount, currency, provider, payee_account, swift_code]
    );
    res.status(201).json({ message: "Payment created successfully" });
  } catch (err) {
    console.error("Payment creation error:", err);
    res.status(500).json({ message: "Error creating payment", error: err.message });
  }
});

// Get customer payments - customer only
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "customer") 
    return res.status(403).json({ message: "Forbidden: customers only" });

  try {
    const payments = await pool.query(
      "SELECT * FROM payments WHERE customer_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(payments.rows);
  } catch (err) {
    console.error("Fetching payments error:", err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

export default router;
