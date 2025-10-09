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

// Enforce HTTPS
app.use(enforceHttps);

// Secure headers
app.use(
  helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: false
  })
);

// Enable CORS
app.use(cors());

// Rate limiting for all requests
app.use(limiter);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

export default app;
