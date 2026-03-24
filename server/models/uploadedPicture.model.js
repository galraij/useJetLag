const pool = require('../db/pool');

const UploadedPictureModel = {
  async create({ url, dateTaken, latitude, longitude }) {
    const { rows } = await pool.query(
      `INSERT INTO uploaded_pictures (url, date_taken, latitude, longitude)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [url, dateTaken, latitude, longitude]
    );
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query(
      `SELECT * FROM uploaded_pictures ORDER BY created_at ASC`
    );
    return rows;
  }
};

module.exports = UploadedPictureModel;
