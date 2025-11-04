export default function enforceHttps(req, res, next) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    const host = req.headers.host;
    const path = req.path || '/';

    // Encode query parameters safely
    const query = Object.keys(req.query).length
      ? `?${new URLSearchParams(req.query).toString()}`
      : '';

    return res.redirect(301, `https://${host}${path}${query}`);
  }
  next();
}
