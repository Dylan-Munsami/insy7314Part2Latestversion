export default function enforceHttps(req, res, next) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    const allowed = (process.env.ALLOWED_HOSTS || process.env.APP_HOST || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const incomingHost = (req.headers.host || '').split(':')[0];
    const safeHost = allowed.length
      ? (allowed.includes(incomingHost) ? incomingHost : null)
      : (process.env.APP_HOST || null);
    if (!safeHost) {
      return res.status(400).send('Invalid host header');
    }
    // Redirect to HTTPS root without using user-controlled path or query to prevent open redirects
    return res.redirect(301, `https://${safeHost}/`);
  }
  next();
}
