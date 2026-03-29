const pool = require('../db/pool');

const TripModel = {
  async create({ title, slug, userId }) {
    const { rows } = await pool.query(
      `INSERT INTO trips (title, slug, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, slug, userId || null]
    );
    return rows[0];
  },

  async getByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM trips WHERE user_id = $1 AND is_published = true ORDER BY id DESC`,
      [userId]
    );
    return rows;
  },

  async getBySlug(slug) {
    const { rows } = await pool.query(
      `SELECT trips.*, users.name as user_name FROM trips LEFT JOIN users ON trips.user_id = users.id WHERE trips.slug = $1`,
      [slug]
    );
    return rows[0];
  },

  async getLatestPublished(limit = 6) {
    const { rows } = await pool.query(
      `SELECT trips.*, users.name as user_name FROM trips LEFT JOIN users ON trips.user_id = users.id WHERE trips.is_published = true ORDER BY trips.id DESC LIMIT $1`,
      [limit]
    );
    return rows;
  },

  async update(id, { title, slug, userId }) {
    const query = userId 
      ? `UPDATE trips SET title = $1, slug = $2, user_id = COALESCE(user_id, $3) WHERE id = $4 RETURNING *`
      : `UPDATE trips SET title = $1, slug = $2 WHERE id = $3 RETURNING *`;
    const params = userId ? [title, slug, userId, id] : [title, slug, id];
    const { rows } = await pool.query(query, params);
    return rows[0];
  },

  async updateStory(id, { story_summary, overview_title, points_of_interest, is_published }) {
    const { rows } = await pool.query(
      `UPDATE trips SET story_summary = $1, overview_title = $2, points_of_interest = $3, is_published = COALESCE($4, is_published) WHERE id = $5 RETURNING *`,
      [story_summary, overview_title, JSON.stringify(points_of_interest), is_published, id]
    );
    return rows[0];
  },
  
  async delete(id) {
    await pool.query(`DELETE FROM trips WHERE id = $1`, [id]);
  }
};

module.exports = TripModel;
