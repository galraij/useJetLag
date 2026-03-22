/**
 * Controller — Posts
 */
const PostModel            = require('../models/post.model');
const postView             = require('../views/post.view');
const { generateBlogPost } = require('../services/openai.service');
const { getWeather }       = require('../services/weather.service');
const { reverseGeocode }   = require('../services/geocoding.service');

async function getAllPosts(req, res, next) {
  try {
    const posts = await PostModel.getAll(req.query);
    postView.list(res, posts);
  } catch (err) { next(err); }
}

async function getMyPosts(req, res, next) {
  try {
    const posts = await PostModel.getByUser(req.user.id);
    postView.list(res, posts);
  } catch (err) { next(err); }
}

async function getPostById(req, res, next) {
  try {
    const post = await PostModel.getById(req.params.id);
    if (!post) return postView.notFound(res);
    postView.single(res, post);
  } catch (err) { next(err); }
}

async function generatePost(req, res, next) {
  try {
    const { imageUrls, exifData = [] } = req.body;

    const locations = await Promise.all(exifData.map((e) => reverseGeocode(e.lat, e.lng)));
    const dates     = exifData.map((e) => e.date).filter(Boolean);
    const first     = exifData[0] || {};

    const [weather, aiPost] = await Promise.all([
      getWeather(first.lat, first.lng),
      generateBlogPost(imageUrls, { locations, dates }),
    ]);

    postView.generated(res, {
      captionAi:    aiPost.body,
      title:        aiPost.title,
      locationName: locations.find(Boolean) || null,
      lat:          first.lat  || null,
      lng:          first.lng  || null,
      dateTaken:    dates[0]   || null,
      weather,
    });
  } catch (err) { next(err); }
}

async function createPost(req, res, next) {
  try {
    const post = await PostModel.create({ userId: req.user.id, ...req.body });
    postView.created(res, post);
  } catch (err) { next(err); }
}

async function updatePost(req, res, next) {
  try {
    const post = await PostModel.update(req.params.id, req.user.id, req.body);
    if (!post) return postView.notFound(res);
    postView.single(res, post);
  } catch (err) { next(err); }
}

async function deleteMyPost(req, res, next) {
  try {
    const post = await PostModel.getById(req.params.id);
    if (!post) return postView.notFound(res);
    if (post.user_id !== req.user.id) return postView.forbidden(res);
    await PostModel.delete(req.params.id);
    postView.deleted(res);
  } catch (err) { next(err); }
}

module.exports = { getAllPosts, getMyPosts, getPostById, generatePost, createPost, updatePost, deleteMyPost };
