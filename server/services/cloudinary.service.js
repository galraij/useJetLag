const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBuffer(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'usejetlag', public_id: filename, resource_type: 'image' },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
    stream.end(buffer);
  });
}

async function deleteImage(url) {
  if (!url) return;
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^.]+$/);
  if (matches && matches[1]) {
    const publicId = matches[1];
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(publicId, (err, result) => {
        if (err) console.error("Cloudinary destroy error:", err);
        resolve(result);
      });
    });
  }
}

module.exports = { uploadBuffer, deleteImage };
