export default function enforceHttps(req, res, next) {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    // Construct safe redirect using the host header (trusted by the server) and path
    const host = req.headers.host; 
    const safePath = req.path;    

    return res.redirect(301, `https://${host}${safePath}`);
  }
  next();
}
