import helmet from "helmet";
import rateLimit from "express-rate-limit";


import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import csurf from "csurf";
import cookieParser from "cookie-parser";

// Security headers with Helmet
export const secureHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiter
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// XSS clean
export const xssProtection = xss();

// NoSQL/SQL injection sanitize
export const sanitizeInputs = mongoSanitize();

// CSRF protection
export const csrfProtection = csurf({ cookie: true });

// Cookie parser for CSRF token
export const parseCookies = cookieParser();
