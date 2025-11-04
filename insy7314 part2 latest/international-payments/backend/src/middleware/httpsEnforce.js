// src/middleware/httpsEnforce.js
function isSafePath(p) {
  if (typeof p !== 'string' || p.length === 0) return false;
  // Must start with single slash and not start with '//' (no protocol-relative or host)
  if (!p.startsWith('/') || p.startsWith('//')) return false;
  // Disallow CR/LF or null bytes
  if (/[\\\r\n\x00]/.test(p)) return false;
  // Allow only a safe subset of characters in the path.
  // This allows percent-encoded chars (%20), alphanumerics and common path characters.
  // Adjust charset if your app needs other characters.
  const safePathRegex = /^\/[A-Za-z0-9\-._~\/%]*$/;
  return safePathRegex.test(p);
}
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
