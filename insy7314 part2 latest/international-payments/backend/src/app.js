// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { body, validationResult, param, query } from "express-validator";

import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import enforceHttps from "./middleware/httpsEnforce.js";

import {
  secureHeaders,
  limiter,
  xssProtection,
  sanitizeInputs,
  parseCookies,
} from "./middleware/security.js";

const app = express();

// --- Security Middleware ---
app.set("trust proxy", 1);
app.use(enforceHttps); // safe HTTPS redirect
app.use(cors({ origin: true, credentials: true }));
app.use(parseCookies);
app.use(express.json());
app.use(xssProtection);
app.use(sanitizeInputs);
app.use(secureHeaders);
app.use(limiter);
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// --- Route Input Validators ---
// Helper function to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Auth Routes Example ---
app.post(
  "/api/auth/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validate,
  authRoutes.login
);

app.post(
  "/api/auth/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("name").isString().trim().notEmpty(),
  validate,
  authRoutes.register
);

// --- Payments Routes Example ---
app.post(
  "/api/payments",
  body("amount").isNumeric(),
  body("currency").isLength({ min: 3, max: 3 }),
  body("recipientId").isString().trim().notEmpty(),
  validate,
  paymentRoutes.processPayment
);

// --- Staff Routes Example ---
app.post(
  "/api/staff",
  body("name").isString().trim().notEmpty(),
  body("role").isIn([" staff"]),
  validate,
  staffRoutes.addStaff
);

// --- Other Routes ---
app.get("/", (req, res) =>
  res.send("🌍 International Payments API running securely!")
);

export default app;
