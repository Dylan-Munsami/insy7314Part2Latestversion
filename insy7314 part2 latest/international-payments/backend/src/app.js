import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: "https://your-frontend-domain.com", // replace with your frontend
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use(morgan("combined"));

// CSRF Protection middleware
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict"
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

// Endpoint to get CSRF token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

export default app;
