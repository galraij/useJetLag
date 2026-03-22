async function reverseGeocode(lat, lng) {
  if (!lat || !lng) return null;
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'useJetLag/1.0' } }
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.display_name?.split(',')[0] ||
      null
    );
  } catch {
    return null;
  }
}

module.exports = { reverseGeocode };
