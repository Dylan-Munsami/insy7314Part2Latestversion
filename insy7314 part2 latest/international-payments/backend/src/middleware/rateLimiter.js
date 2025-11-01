import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator
});

export default limiter;
