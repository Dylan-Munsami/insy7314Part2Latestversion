// backend/src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import enforceHttps from "./middleware/httpsEnforce.js";
import limiter from "./middleware/rateLimiter.js";

const app = express();

// Trust proxy headers (needed for rate limiter behind cloud proxies)
app.set("trust proxy", 1);

// Enforce HTTPS
app.use(enforceHttps);

// Secure headers with Helmet
app.use(
  helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: false, // optional: can customize later
  })
);

// Enable CORS
app.use(cors());

// Rate limiting for all requests
app.use(limiter);

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

// Root endpoint
app.get("/", (req, res) =>
  res.send("🌍 International Payments API running securely!")
);

export default app;
