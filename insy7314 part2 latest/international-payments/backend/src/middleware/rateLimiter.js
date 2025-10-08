import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // tighter limit
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

export default limiter;
