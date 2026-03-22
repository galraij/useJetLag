/**
 * Controller — Upload
 */
const { uploadBuffer } = require('../services/cloudinary.service');
const uploadView       = require('../views/upload.view');

async function uploadImages(req, res, next) {
  try {
    if (!req.files?.length) return uploadView.noFiles(res);

    const imageUrls = await Promise.all(
      req.files.map((f) => uploadBuffer(f.buffer, `${Date.now()}-${f.originalname}`))
    );

    uploadView.success(res, imageUrls);
  } catch (err) { next(err); }
}

module.exports = { uploadImages };
