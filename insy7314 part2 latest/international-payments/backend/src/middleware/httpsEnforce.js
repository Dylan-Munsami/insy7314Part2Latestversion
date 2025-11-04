export default function enforceHttps(req, res, next) {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    
    const secureDomain = process.env.SECURE_DOMAIN || 'your-secure-domain.com';
    return res.redirect(301, `https://${secureDomain}${req.url}`);
  }
  next();
}