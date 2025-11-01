export default function enforceHttps(req, res, next) {
  // Only enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    // Safe redirect: always redirect to your own domain and path
    const host = "yourdomain.com"; // <-- replace with your real domain
    const path = req.url; // safe because it stays on your server
    return res.redirect(301, `https://${host}${path}`);
  }
  next();
}
