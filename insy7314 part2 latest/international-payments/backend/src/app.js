import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import staffRoutes from "./routes/staff.js";
import enforceHttps from "./middleware/httpsEnforce.js";
import helmet from "helmet";

import {
  secureHeaders,
  limiter,
  xssProtection,
  sanitizeInputs,
  parseCookies,
} from "./middleware/security.js";

const app = express();

app.set("trust proxy", 1);
app.use(enforceHttps);
app.use(cors({ origin: true, credentials: true }));
app.use(parseCookies);
app.use(express.json());
app.use(xssProtection);
app.use(sanitizeInputs);
app.use(secureHeaders);
app.use(limiter);

<<<<<<< HEAD


app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

=======
>>>>>>> upstream/main
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => res.send("🌍 International Payments API running securely!"));

export default app;
