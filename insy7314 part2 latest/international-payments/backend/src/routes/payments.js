import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { pool } from "../db/db.js";
import { validatePayment } from "../validators/inputValidators.js";

const router = express.Router();

// Add Payment
router.post("/", verifyToken, async (req, res) => {
  if (!validatePayment(req.body))
    return res.status(400).json({ message: "Invalid payment details" });

  const { amount, currency, provider, payee_account, swift_code } = req.body;

  try {
    await pool.query(
      `INSERT INTO payments (customer_id, amount, currency, provider, payee_account, swift_code)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.user.id, amount, currency, provider, payee_account, swift_code]
    );
    res.status(201).json({ message: "Payment created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating payment", error: err.message });
  }
});

// View user payments
router.get("/", verifyToken, async (req, res) => {
  try {
    const payments = await pool.query("SELECT * FROM payments WHERE customer_id=$1", [req.user.id]);
    res.json(payments.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

export default router;
