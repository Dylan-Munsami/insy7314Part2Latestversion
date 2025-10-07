import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import enforceHttps from "./middleware/httpsenforce.js";
import rateLimiter from "./middleware/ratelimiter.js";

const app = express();

// Security headers
app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true })); // HSTS
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
    },
  })
);

app.use(cors());
app.use(enforceHttps);
app.use(rateLimiter);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) =>
  res.send("🌍 International Payments API running securely!")
);

export default app;
