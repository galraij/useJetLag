/**
 * View — Post
 */
const postView = {
  list(res, posts) {
    res.status(200).json(posts);
  },
  single(res, post) {
    res.status(200).json(post);
  },
  created(res, post) {
    res.status(201).json(post);
  },
  generated(res, data) {
    res.status(200).json(data);
  },
  deleted(res) {
    res.status(200).json({ success: true });
  },
  notFound(res) {
    res.status(404).json({ error: 'Post not found' });
  },
  forbidden(res) {
    res.status(403).json({ error: 'Not your post' });
  },
};

module.exports = postView;
