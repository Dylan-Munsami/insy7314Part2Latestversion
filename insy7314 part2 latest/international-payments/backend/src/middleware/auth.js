// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verifyToken(req, res, next) {
  try {
    // Read token from httpOnly cookie first (recommended)
    const cookieToken = req.cookies?.token;
    const header = req.headers["authorization"];
    const headerToken = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
    const token = cookieToken || headerToken;

    if (!token) return res.status(403).json({ message: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
