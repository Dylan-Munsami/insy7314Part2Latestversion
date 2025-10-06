import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import enforceHttps from "./middleware/httpsEnforce.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use(enforceHttps);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));
export default app;
