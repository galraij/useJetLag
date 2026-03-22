async function getWeather(lat, lng) {
  if (!lat || !lng) return null;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=he`;
    const res  = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      summary:     data.weather?.[0]?.description || null,
      temperature: data.main?.temp ?? null,
    };
  } catch {
    return null;
  }
}

module.exports = { getWeather };
