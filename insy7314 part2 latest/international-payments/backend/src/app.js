// backend/src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import enforceHttps from "./middleware/httpsEnforce.js";

const app = express();

// Enforce HTTPS
app.use(enforceHttps);

// Security headers with Helmet
app.use(
  helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Enforce HSTS
    contentSecurityPolicy: false, // Can configure if needed
  })
);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

export default app;
