// backend/src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";

const app = express();

// ✅ Security middleware
app.use(helmet());

// ✅ CORS setup — allow local dev, Render, and future frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://insy7314part2latestversion.onrender.com",
    "https://your-frontend-domain.com" // optional, replace when ready
  ],
  credentials: true
}));

// ✅ Parsing middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Logging middleware
app.use(morgan("combined"));

// ❌ REMOVE or DISABLE CSRF for now (caused the route blocking)
// import csurf from "csurf";
// const csrfProtection = csurf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Strict"
//   }
// });

// app.get("/api/csrf-token", csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🌍 International Payments API running securely!");
});

// ✅ Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

export default app;
