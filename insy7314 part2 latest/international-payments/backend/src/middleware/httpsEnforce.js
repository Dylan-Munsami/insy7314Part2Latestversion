export default function enforceHttps(req, res, next) {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers['x-forwarded-proto'];

    if (proto && proto !== 'https') {
      // Use ALLOWED_HOSTS, APP_HOST, or fallback to localhost for local testing
      const allowed = (process.env.ALLOWED_HOSTS || process.env.APP_HOST || 'localhost')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const incomingHost = (req.headers.host || '').split(':')[0];
      const safeHost = allowed.includes(incomingHost) ? incomingHost : null;

      if (!safeHost) {
        return res.status(400).send('Invalid host header');
      }

      // Redirect to HTTPS root
      return res.redirect(301, `https://${safeHost}/`);
    }
  }

  // Development mode or already HTTPS
  next();
}
