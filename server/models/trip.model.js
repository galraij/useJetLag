const pool = require('../db/pool');

const TripModel = {
  async create({ title, slug, userId }) {
    const { rows } = await pool.query(
      `INSERT INTO trips (title, slug, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, slug, userId || null]
    );
    return rows[0];
  },

  async getBySlug(slug) {
    const { rows } = await pool.query(
      `SELECT trips.*, users.name as user_name FROM trips LEFT JOIN users ON trips.user_id = users.id WHERE trips.slug = $1`,
      [slug]
    );
    return rows[0];
  },

  async update(id, { title, slug, userId }) {
    const query = userId 
      ? `UPDATE trips SET title = $1, slug = $2, user_id = COALESCE(user_id, $3) WHERE id = $4 RETURNING *`
      : `UPDATE trips SET title = $1, slug = $2 WHERE id = $3 RETURNING *`;
    const params = userId ? [title, slug, userId, id] : [title, slug, id];
    const { rows } = await pool.query(query, params);
    return rows[0];
  },

  async updateStory(id, { story_summary, points_of_interest, is_published }) {
    const { rows } = await pool.query(
      `UPDATE trips SET story_summary = $1, points_of_interest = $2, is_published = COALESCE($3, is_published) WHERE id = $4 RETURNING *`,
      [story_summary, JSON.stringify(points_of_interest), is_published, id]
    );
    return rows[0];
  }
};

module.exports = TripModel;
