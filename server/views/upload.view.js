/**
 * View — Upload
 */
const uploadView = {
  success(res, imageUrls) {
    res.status(200).json({ imageUrls });
  },
  noFiles(res) {
    res.status(400).json({ error: 'No images provided' });
  },
};

module.exports = uploadView;
