export default function requireStaff(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Missing token" });
  if (req.user.role !== "staff") return res.status(403).json({ message: "Forbidden: staff only" });
  next();
}
