/**
 * Model — User
 * אחראי אך ורק על שאילתות SQL הקשורות למשתמשים.
 * אין כאן לוגיקה עסקית — זו אחריות ה-Controller.
 */
const pool = require('../db/pool');

const UserModel = {
  async create({ email, password_hash, name }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, role`,
      [email, password_hash, name]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, email, name, role, is_blocked FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async getAll() {
    const { rows } = await pool.query(
      `SELECT id, email, name, role, is_blocked, created_at
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  },

  async setBlocked(id, is_blocked) {
    const { rows } = await pool.query(
      `UPDATE users SET is_blocked = $1 WHERE id = $2
       RETURNING id, email, is_blocked`,
      [is_blocked, id]
    );
    return rows[0];
  },
};

module.exports = UserModel;
