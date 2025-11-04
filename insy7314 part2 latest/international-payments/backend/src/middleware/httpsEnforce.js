// src/middleware/httpsEnforce.js
export default function enforceHttps(req, res, next) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    // 1) Build allowlist from env (comma-separated), or use single APP_HOST
    // e.g. ALLOWED_HOSTS=example.com,api.example.com
    const allowed = (process.env.ALLOWED_HOSTS || process.env.APP_HOST || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // 2) Get incoming host header (note: user-controlled) and normalize (remove port)
    const incomingHost = (req.headers.host || '').split(':')[0];

    // 3) If host is allowed use it; otherwise fall back to configured APP_HOST or deny
    const safeHost = allowed.length
      ? (allowed.includes(incomingHost) ? incomingHost : null)
      : (process.env.APP_HOST || null);

    if (!safeHost) {
      // Host not allowed — either reject or redirect to a fixed safe host
      // Safer: deny the redirect and continue (or send 400). Here we send 400.
      return res.status(400).send('Invalid host header');
    }

    // 4) Build safe path and encoded query string
    const path = req.path || '/';
    const query = Object.keys(req.query).length
      ? `?${new URLSearchParams(req.query).toString()}`
      : '';

    // 5) Redirect using only validated host and encoded query
    return res.redirect(301, `https://${safeHost}${path}${query}`);
  }
  next();
}
