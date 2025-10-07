import rateLimit from "express-rate-limit";

/**
 * Global rate limiter middleware
 * ---------------------------------
 * Prevents brute-force and DDoS attacks by limiting
 * the number of requests per IP address in a set window.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later."
  }
});

export default limiter;
