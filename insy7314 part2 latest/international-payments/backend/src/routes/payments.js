
// backend/src/routes/payments.js
import express from "express";
import { pool } from "../db/db.js";
import { verifyToken } from "../middleware/auth.js";
import { validatePayment } from "../validators/inputValidators.js";

const router = express.Router();

// Add payment
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "customer") return res.status(403).json({ message: "Forbidden: customers only" });
  if (!validatePayment(req.body)) return res.status(400).json({ message: "Invalid payment data" });

  const { amount, currency, provider, payee_account, swift_code } = req.body;

  try {
    await pool.query(
      `INSERT INTO payments (customer_id, amount, currency, provider, payee_account, swift_code)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.user.id, amount, currency, provider, payee_account, swift_code]
    );
    res.status(201).json({ message: "Payment created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating payment", error: err.message });
  }
});

// Get customer payments
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "customer") return res.status(403).json({ message: "Forbidden: customers only" });

  try {
    const payments = await pool.query("SELECT * FROM payments WHERE customer_id=$1 ORDER BY created_at DESC", [req.user.id]);
    res.json(payments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

export default router;
