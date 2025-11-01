import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireStaff(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Missing token" });
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });
  next();
}
