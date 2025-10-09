// backend/src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use the correct IP behind proxies
    return req.ip;
  }
});

export default limiter;
