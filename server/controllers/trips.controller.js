const TripModel = require('../models/trip.model');
const UploadedPictureModel = require('../models/uploadedPicture.model');

async function getTripBySlug(req, res, next) {
  try {
    const trip = await TripModel.getBySlug(req.params.slug);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const pictures = await UploadedPictureModel.getByTripId(trip.id);
    res.status(200).json({ success: true, trip, pictures });
  } catch (err) {
    next(err);
  }
}

async function updateTripTitle(req, res, next) {
  try {
    const trip = await TripModel.getBySlug(req.params.slug);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const updatedTrip = await TripModel.update(trip.id, { title, slug: newSlug });

    res.status(200).json({ success: true, trip: updatedTrip });
  } catch (err) {
    next(err);
  }
}

async function generateTripStory(req, res, next) {
  try {
    const trip = await TripModel.getBySlug(req.params.slug);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const pictures = await UploadedPictureModel.getByTripId(trip.id);
    if (!pictures.length) return res.status(400).json({ error: 'No pictures to process' });

    // Call Gemini
    const { generateStory } = require('../services/gemini.service');
    const jsonOutput = await generateStory(pictures);

    // Save trip level data
    const updatedTrip = await TripModel.updateStory(trip.id, {
      story_summary: jsonOutput.full_narrative_summary,
      points_of_interest: jsonOutput.points_of_interest
    });

    // Save individual picture data
    for (const p of jsonOutput.photos) {
      // Find the db ID matching the AI response (it returns string because input might be string)
      const picId = parseInt(p.image_id, 10);
      if (!isNaN(picId)) {
        await UploadedPictureModel.updateAiData(picId, {
          punchy_description: p.punchy_description,
          story_segment: p.associated_story_segment
        });
      }
    }

    // Return the fresh data
    const updatedPictures = await UploadedPictureModel.getByTripId(trip.id);
    res.status(200).json({ success: true, trip: updatedTrip, pictures: updatedPictures, geminiJSON: jsonOutput });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTripBySlug, updateTripTitle, generateTripStory };
