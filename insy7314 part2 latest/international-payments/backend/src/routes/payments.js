// backend/src/routes/payments.js
import express from "express";
import { pool } from "../db/db.js";
import { verifyToken } from "../middleware/auth.js";
import { validatePayment } from "../validators/inputValidators.js";

const router = express.Router();

// Add payment
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "customer") return res.status(403).json({ message: "Forbidden: customers only" });

  // server-side validation
  if (!validatePayment(req.body)) return res.status(400).json({ message: "Invalid payment data" });

  const { amount, currency, provider, payee_account, swift_code } = req.body;
  try {
    await pool.query(
      `INSERT INTO payments (customer_id, amount, currency, provider, payee_account, swift_code)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.user.id, amount, currency.toUpperCase(), provider, payee_account, swift_code.toUpperCase()]
    );
    res.status(201).json({ message: "Payment created successfully" });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Error creating payment" });
  }
});

// Get customer payments
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "customer") return res.status(403).json({ message: "Forbidden: customers only" });

  try {
    const payments = await pool.query("SELECT id, amount, currency, provider, payee_account, swift_code, verified, created_at FROM payments WHERE customer_id=$1 ORDER BY created_at DESC", [req.user.id]);
    res.json(payments.rows);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

export default router;
