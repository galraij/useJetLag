const router          = require('express').Router();
const verifyToken     = require('../middleware/auth.middleware');
const upload          = require('../middleware/upload.middleware');
const { uploadImages, uploadWithExif } = require('../controllers/upload.controller');

router.post('/', verifyToken, upload.array('images', 20), uploadImages);
router.post('/with-exif', upload.array('images', 20), uploadWithExif); // Make this public given "get started free" might be public

module.exports = router;
