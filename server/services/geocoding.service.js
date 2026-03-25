async function reverseGeocode(lat, lng) {
  if (!lat || !lng) return null;
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'useJetLag/1.0' } }
    );
    const data = await res.json();
    
    // Attempt to extract Point of Interest
    const address = data.address || {};
    const poi = address.tourism || address.amenity || address.historic || address.building || address.leisure || address.attraction || address.university || null;
    
    // Try to get a comprehensive city name
    const city = address.city || address.town || address.village || address.municipality || null;
    const country = address.country || null;

    return { city, country, poi };
  } catch {
    return null;
  }
}

module.exports = { reverseGeocode };
