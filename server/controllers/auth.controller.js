/**
 * Controller — Auth
 * מקבל Request → קורא ל-Model → מחזיר תגובה דרך View
 */
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const authView  = require('../views/auth.view');

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });

    const existing = await UserModel.findByEmail(email);
    if (existing) return authView.conflict(res);

    const passwordHash = await bcrypt.hash(password, 10);
    const user  = await UserModel.create({ email, passwordHash, name });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    authView.created(res, { user, token });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);

    if (!user)           return authView.unauthorized(res);
    if (user.is_blocked) return authView.forbidden(res);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return authView.unauthorized(res);

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    authView.success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
}

module.exports = { register, login };
