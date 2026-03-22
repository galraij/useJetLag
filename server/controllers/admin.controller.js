/**
 * Controller — Admin
 */
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const adminView = require('../views/admin.view');

async function getUsers(req, res, next) {
  try {
    adminView.userList(res, await UserModel.getAll());
  } catch (err) { next(err); }
}

async function adminDeletePost(req, res, next) {
  try {
    await PostModel.delete(req.params.id);
    adminView.deleted(res);
  } catch (err) { next(err); }
}

async function blockUser(req, res, next) {
  try {
    const user = await UserModel.setBlocked(req.params.id, true);
    adminView.userBlocked(res, user);
  } catch (err) { next(err); }
}

module.exports = { getUsers, adminDeletePost, blockUser };
