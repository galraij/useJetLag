/**
 * Controller — Upload
 */
const { uploadBuffer } = require('../services/cloudinary.service');
const uploadView       = require('../views/upload.view');
const exifr            = require('exifr');
const UploadedPictureModel = require('../models/uploadedPicture.model');

async function uploadImages(req, res, next) {
  try {
    if (!req.files?.length) return uploadView.noFiles(res);

    const imageUrls = await Promise.all(
      req.files.map((f) => uploadBuffer(f.buffer, `${Date.now()}-${f.originalname}`))
    );

    uploadView.success(res, imageUrls);
  } catch (err) { next(err); }
}

async function uploadWithExif(req, res, next) {
  try {
    if (!req.files?.length) return uploadView.noFiles(res);

    const results = await Promise.all(
      req.files.map(async (f) => {
        // 1. Upload to Cloudinary
        const url = await uploadBuffer(f.buffer, `${Date.now()}-${f.originalname}`);
        
        let dateTaken = null;
        let latitude = null;
        let longitude = null;

        // 2. Extract EXIF
        try {
          const exifData = await exifr.parse(f.buffer);
          if (exifData) {
            if (exifData.DateTimeOriginal) dateTaken = exifData.DateTimeOriginal;
            if (exifData.latitude) latitude = exifData.latitude;
            if (exifData.longitude) longitude = exifData.longitude;
          }
        } catch (exifErr) {
          console.error("Exif extraction failed for file", f.originalname, exifErr);
        }

        // 3. Save to uploaded_pictures DB table
        const savedPic = await UploadedPictureModel.create({
          url,
          dateTaken,
          latitude,
          longitude
        });

        return savedPic;
      })
    );

    res.status(200).json({ success: true, pictures: results });
  } catch (err) { next(err); }
}

async function getUploadedPictures(req, res, next) {
  try {
    const pictures = await UploadedPictureModel.getAll();
    res.status(200).json({ success: true, pictures });
  } catch (err) { next(err); }
}

module.exports = { uploadImages, uploadWithExif, getUploadedPictures };
