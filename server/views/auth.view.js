/**
 * View — Auth
 * מעצב את תגובות ה-JSON שחוזרות ללקוח.
 * ה-Controller קורא לפונקציות אלה במקום לכתוב res.json ישירות.
 */
const authView = {
  success(res, { user, token }) {
    res.status(200).json({ token, user });
  },
  created(res, { user, token }) {
    res.status(201).json({ token, user });
  },
  unauthorized(res, message = 'Invalid credentials') {
    res.status(401).json({ error: message });
  },
  forbidden(res, message = 'Account is blocked') {
    res.status(403).json({ error: message });
  },
  conflict(res, message = 'Email already in use') {
    res.status(409).json({ error: message });
  },
};

module.exports = authView;
