const router          = require('express').Router();
const verifyToken     = require('../middleware/auth.middleware');
const upload          = require('../middleware/upload.middleware');
const { uploadImages } = require('../controllers/upload.controller');

router.post('/', verifyToken, upload.array('images', 20), uploadImages);

module.exports = router;
