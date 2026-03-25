const router = require('express').Router();
const { getTripBySlug, updateTripTitle, generateTripStory } = require('../controllers/trips.controller');

router.get('/:slug', getTripBySlug);
router.put('/:slug', updateTripTitle);
router.post('/:slug/generate-story', generateTripStory);

module.exports = router;
