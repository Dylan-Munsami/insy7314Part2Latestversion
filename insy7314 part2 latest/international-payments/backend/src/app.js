import express from "express";
import helmet from "helmet";
import cors from "cors";
import enforceHttps from "./middleware/httpsEnforce.js";
import limiter from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";

const app = express();

// ✅ Security middlewares
app.use(helmet({
  contentSecurityPolicy: false, // allow API requests
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.onrender.com"], // adjust as needed
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(limiter);
app.use(enforceHttps);

// ✅ Extra headers for HSTS and CSP
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 Secure International Payments API running with SSL + protections!"));

export default app;
