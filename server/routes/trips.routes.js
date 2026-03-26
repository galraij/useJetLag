const router = require('express').Router();
const { getTripBySlug, updateTripTitle, generateTripStory, publishTripStory, getMyTrips } = require('../controllers/trips.controller');

router.get('/my/all', getMyTrips);
router.get('/:slug', getTripBySlug);
router.put('/:slug', updateTripTitle);
router.post('/:slug/generate-story', generateTripStory);
router.put('/:slug/publish', publishTripStory);

module.exports = router;
