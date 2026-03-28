const TripModel = require('../models/trip.model');
const UploadedPictureModel = require('../models/uploadedPicture.model');

async function getMyTrips(req, res, next) {
  try {
    const jwt = require('jsonwebtoken');
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    
    let userId;
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch(e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const trips = await TripModel.getByUser(userId);
    
    const enhancedTrips = await Promise.all(trips.map(async (trip) => {
      const pictures = await UploadedPictureModel.getByTripId(trip.id);
      
      let coverImage = pictures.length > 0 ? pictures[0].url : null;
      let earliestDate = null;
      let latestDate = null;
      let location = "Unknown";
      
      if (pictures.length > 0) {
         const validDates = pictures.map(p => new Date(p.date_taken)).filter(d => !isNaN(d.getTime()));
         if (validDates.length > 0) {
            validDates.sort((a,b) => a - b);
            earliestDate = validDates[0];
            latestDate = validDates[validDates.length - 1];
         }
         
         const locCounts = {};
         pictures.forEach(p => {
           if (p.city || p.country) {
             const key = [p.city, p.country].filter(Boolean).join(', ');
             locCounts[key] = (locCounts[key] || 0) + 1;
           }
         });
         
         let maxCount = 0;
         for (const [loc, count] of Object.entries(locCounts)) {
            if (count > maxCount) {
               maxCount = count;
               location = loc;
            }
         }
      }

      return {
        ...trip,
        coverImage,
        earliestDate,
        latestDate,
        location,
        photosCount: pictures.length
      };
    }));

    res.status(200).json({ success: true, trips: enhancedTrips });
  } catch (err) {
    next(err);
  }
}

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
    const jwt = require('jsonwebtoken');
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) { console.error('Token extraction failed', err); }
    }

    const { slug } = req.params;
    const { title, story_summary, points_of_interest, pictures } = req.body;

    const trip = await TripModel.getBySlug(slug);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Ensure safe slug if title changes
    const newSlug = trip.title === title ? slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    // Update Title & Story
    await TripModel.update(trip.id, { title, slug: newSlug, userId });
    await TripModel.updateStory(trip.id, { story_summary, points_of_interest, is_published: true });

    // Fetch the fresh full record containing joined users table (user_name)
    const fullyUpdatedTrip = await TripModel.getBySlug(newSlug);

    // Update specific pictures
    for (const p of pictures) {
      await UploadedPictureModel.updateAiData(p.id, {
        punchy_description: p.punchy_description || null,
        story_segment: p.story_segment || null
      });
    }

    // Return finalized fresh data
    const finalPictures = await UploadedPictureModel.getByTripId(trip.id);
    res.status(200).json({ success: true, trip: fullyUpdatedTrip, pictures: finalPictures });
  } catch (err) {
    next(err);
  }
}

async function getLatestPublishedTrips(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const trips = await TripModel.getLatestPublished(limit);
    
    const enhancedTrips = await Promise.all(trips.map(async (trip) => {
      const pictures = await UploadedPictureModel.getByTripId(trip.id);
      
      let coverImage = pictures.length > 0 ? pictures[0].url : null;
      let location = "Unknown";
      let displayDate = null;
      
      if (pictures.length > 0) {
         const validDates = pictures.map(p => new Date(p.date_taken)).filter(d => !isNaN(d.getTime()));
         if (validDates.length > 0) {
            validDates.sort((a,b) => a - b);
            displayDate = validDates[0];
         }
         
         const locCounts = {};
         pictures.forEach(p => {
           if (p.city || p.country) {
             const key = [p.city, p.country].filter(Boolean).join(', ');
             locCounts[key] = (locCounts[key] || 0) + 1;
           }
         });
         
         let maxCount = 0;
         for (const [loc, count] of Object.entries(locCounts)) {
            if (count > maxCount) {
               maxCount = count;
               location = loc;
            }
         }
      }

      const locParts = location.split(', ');
      
      let formattedMonth = "Unknown";
      let formattedYear = "";
      if (displayDate) {
         formattedMonth = displayDate.toLocaleString('default', { month: 'short' });
         formattedYear = displayDate.getFullYear();
      }

      return {
        id: trip.id,
        slug: trip.slug,
        title: trip.title,
        image: coverImage || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
        region: locParts[0] || 'World',
        country: locParts[1] || locParts[0] || 'Unknown',
        month: formattedMonth,
        year: formattedYear,
        user_name: trip.user_name
      };
    }));

    res.status(200).json({ success: true, trips: enhancedTrips });
  } catch (err) {
    next(err);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const jwt = require('jsonwebtoken');
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    let userId;
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch(e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { id } = req.params;

    const pictures = await UploadedPictureModel.getByTripId(id);
    const { deleteImage } = require('../services/cloudinary.service');
    for (const pic of pictures) {
      await deleteImage(pic.url);
    }
    
    await UploadedPictureModel.deleteByTripId(id);
    await TripModel.delete(id);

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTripBySlug, updateTripTitle, generateTripStory, publishTripStory, getMyTrips, getLatestPublishedTrips, deleteTrip };
