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

    // DO NOT save to DB yet. Just return the generated JSON to frontend for drafting.
    res.status(200).json({ success: true, geminiJSON: jsonOutput });
  } catch (err) {
    next(err);
  }
}

async function publishTripStory(req, res, next) {
  try {
    const { slug } = req.params;
    const { title, story_summary, points_of_interest, pictures } = req.body;

    const trip = await TripModel.getBySlug(slug);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Ensure safe slug if title changes
    const newSlug = trip.title === title ? slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    // Update Title & Story
    await TripModel.update(trip.id, { title, slug: newSlug });
    const updatedTrip = await TripModel.updateStory(trip.id, { story_summary, points_of_interest });

    // Update specific pictures
    for (const p of pictures) {
      await UploadedPictureModel.updateAiData(p.id, {
        punchy_description: p.punchy_description || null,
        story_segment: p.story_segment || null
      });
    }

    // Return finalized fresh data
    const finalPictures = await UploadedPictureModel.getByTripId(trip.id);
    res.status(200).json({ success: true, trip: updatedTrip, pictures: finalPictures });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTripBySlug, updateTripTitle, generateTripStory, publishTripStory };
