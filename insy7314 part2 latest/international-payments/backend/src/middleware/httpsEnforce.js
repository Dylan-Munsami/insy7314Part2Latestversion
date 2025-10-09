// backend/src/middleware/httpsenforce.js
export default function enforceHttps(req, res, next) {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
}
