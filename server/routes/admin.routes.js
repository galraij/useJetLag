const router                                  = require('express').Router();
const verifyToken                             = require('../middleware/auth.middleware');
const isAdmin                                 = require('../middleware/admin.middleware');
const { getUsers, adminDeletePost, blockUser } = require('../controllers/admin.controller');

router.use(verifyToken, isAdmin);

router.get('/users',             getUsers);
router.delete('/posts/:id',      adminDeletePost);
router.patch('/users/:id/block', blockUser);

module.exports = router;
