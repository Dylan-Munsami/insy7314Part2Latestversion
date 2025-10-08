// backend/src/routes/payments.js
import express from "express";
import { pool } from "../db/db.js";
import { verifyToken } from "../middleware/auth.js";
import { validatePayment } from "../validators/inputValidators.js";

const router = express.Router();

// Create payment
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "customer") return res.status(403).json({ message: "Forbidden: customers only" });
  if (!validatePayment(req.body)) return res.status(400).json({ message: "Invalid payment data" });

  const { amount, currency, provider, payee_account, swift_code } = req.body;
  try {
    const p = await pool;
    await p.request()
      .input("customer_id", req.user.id)
      .input("amount", amount)
      .input("currency", currency)
      .input("provider", provider)
      .input("payee_account", payee_account)
      .input("swift_code", swift_code)
      .query(`INSERT INTO payments (customer_id, amount, currency, provider, payee_account, swift_code)
              VALUES (@customer_id,@amount,@currency,@provider,@payee_account,@swift_code)`);

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
    const p = await pool;
    const result = await p.request()
      .input("customer_id", req.user.id)
      .query("SELECT * FROM payments WHERE customer_id=@customer_id ORDER BY created_at DESC");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

export default router;
