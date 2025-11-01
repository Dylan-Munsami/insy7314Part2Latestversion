export default function enforceHttps(req, res, next) {
  // Only enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
const host = "insy7314part2latestversion.onrender.com"; // production API domain
return res.redirect(301, `https://${host}${req.url}`);
   
  }
  next();
}
