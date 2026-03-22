const router      = require('express').Router();
const verifyToken = require('../middleware/auth.middleware');
const {
  getAllPosts, getMyPosts, getPostById,
  generatePost, createPost, updatePost, deleteMyPost,
} = require('../controllers/posts.controller');

router.get('/',            getAllPosts);
router.get('/my',          verifyToken, getMyPosts);
router.get('/:id',         getPostById);
router.post('/generate',   verifyToken, generatePost);
router.post('/',           verifyToken, createPost);
router.patch('/:id',       verifyToken, updatePost);
router.delete('/:id',      verifyToken, deleteMyPost);

module.exports = router;
