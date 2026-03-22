/**
 * View — Admin
 */
const adminView = {
  userList(res, users) {
    res.status(200).json(users);
  },
  userBlocked(res, user) {
    res.status(200).json(user);
  },
  deleted(res) {
    res.status(200).json({ success: true });
  },
};

module.exports = adminView;
