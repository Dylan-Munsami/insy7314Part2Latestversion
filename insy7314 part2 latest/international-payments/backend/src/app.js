import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import enforceHttps from "./middleware/httpsEnforce.js";
import limiter from "./middleware/rateLimiter.js";

const app = express();

app.set("trust proxy", 1);
app.use(enforceHttps);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(limiter);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

export default app;
