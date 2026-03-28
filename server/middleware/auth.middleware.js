const { verifySupabaseToken } = require('../utils/jwt.utils');

async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    req.user = await verifySupabaseToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
