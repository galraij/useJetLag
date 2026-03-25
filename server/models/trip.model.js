const pool = require('../db/pool');

const TripModel = {
  async create({ title, slug }) {
    const { rows } = await pool.query(
      `INSERT INTO trips (title, slug) VALUES ($1, $2) RETURNING *`,
      [title, slug]
    );
    return rows[0];
  },

  async getBySlug(slug) {
    const { rows } = await pool.query(
      `SELECT * FROM trips WHERE slug = $1`,
      [slug]
    );
    return rows[0];
  },

  async update(id, { title, slug }) {
    const { rows } = await pool.query(
      `UPDATE trips SET title = $1, slug = $2 WHERE id = $3 RETURNING *`,
      [title, slug, id]
    );
    return rows[0];
  },

  async updateStory(id, { story_summary, points_of_interest }) {
    const { rows } = await pool.query(
      `UPDATE trips SET story_summary = $1, points_of_interest = $2 WHERE id = $3 RETURNING *`,
      [story_summary, JSON.stringify(points_of_interest), id]
    );
    return rows[0];
  }
};

module.exports = TripModel;
