export default function enforceHttps(req, res, next) {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    const host = req.headers.host;
    const url = req.url;
    return res.redirect(301, `https://${host}${url}`);
  }
  next();
}
