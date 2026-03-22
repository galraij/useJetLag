/**
 * Model — Post
 * אחראי אך ורק על שאילתות SQL הקשורות לפוסטים.
 */
const pool = require('../db/pool');

const PostModel = {
  async create({ userId, imageUrls, captionAi, captionUser, locationName, lat, lng, dateTaken, weatherSummary, temperature }) {
    const { rows } = await pool.query(
      `INSERT INTO posts
         (user_id, image_urls, caption_ai, caption_user,
          location_name, lat, lng, date_taken, weather_summary, temperature)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [userId, imageUrls, captionAi, captionUser, locationName, lat, lng, dateTaken, weatherSummary, temperature]
    );
    return rows[0];
  },

  async getAll({ location, date } = {}) {
    const params = [];
    let where = `WHERE u.is_blocked = false`;

    if (location) { params.push(`%${location}%`); where += ` AND p.location_name ILIKE $${params.length}`; }
    if (date)     { params.push(date);             where += ` AND TO_CHAR(p.date_taken,'YYYY-MM') = $${params.length}`; }

    const { rows } = await pool.query(
      `SELECT p.*, u.name AS author_name
       FROM posts p JOIN users u ON p.user_id = u.id
       ${where} ORDER BY p.created_at DESC`,
      params
    );
    return rows;
  },

  async getByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query(
      `SELECT p.*, u.name AS author_name
       FROM posts p JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async update(id, userId, { captionUser }) {
    const { rows } = await pool.query(
      `UPDATE posts SET caption_user = $1
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [captionUser, id, userId]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
  },
};

module.exports = PostModel;
