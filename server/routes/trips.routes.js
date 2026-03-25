const router = require('express').Router();
const { getTripBySlug, updateTripTitle, generateTripStory, publishTripStory } = require('../controllers/trips.controller');

router.get('/:slug', getTripBySlug);
router.put('/:slug', updateTripTitle);
router.post('/:slug/generate-story', generateTripStory);
router.put('/:slug/publish', publishTripStory);

module.exports = router;
