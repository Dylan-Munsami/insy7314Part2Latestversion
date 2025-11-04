import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import staffRoutes from './routes/staff.js';
import paymentRoutes from "./routes/payments.js";
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
app.use(enforceHttps);
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

// --- Routes ---
app.use("/api/auth", authRoutes);       // router handles /login internally
app.use("/api/payments", paymentRoutes); // same logic for payments router
app.use('/api/staff', staffRoutes); 

app.get("/", (req, res) =>
  res.send("🌍 International Payments API running securely!")
);

export default app;
