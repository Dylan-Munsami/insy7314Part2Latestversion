// backend/src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

export default app;
