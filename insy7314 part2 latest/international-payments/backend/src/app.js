// backend/src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// If behind a proxy (Render/Heroku), trust proxy so secure cookies and x-forwarded headers work
app.set("trust proxy", 1);

// body parser limits (protect against large payloads)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// cookies
app.use(cookieParser());

// security headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:3000"],
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  })
);
// HSTS
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

// CORS: restrict allowed origin(s)
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000"];
app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools (no origin) such as Postman
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS policy: Origin not allowed"));
  },
  credentials: true
}));

// CSRF protection using cookie-based tokens
// We expose a GET route that returns the CSRF token to the frontend
const csrfProtection = csurf({ cookie: true });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

// csrf token route (frontend should fetch this and send it back in X-CSRF-Token header for modifying requests)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Root
app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

// Error handler (central)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  // if csurf error
  if (err && err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ message: "Internal server error" });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error", stack: err.stack });
});

export default app;
