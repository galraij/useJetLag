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
  }
};

module.exports = UploadedPictureModel;
