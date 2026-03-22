import exifr from 'exifr';

export async function extractExif(file) {
  try {
    const data = await exifr.parse(file, { gps: true, pick: ['DateTimeOriginal', 'GPSLatitude', 'GPSLongitude'] });
    if (!data) return {};
    return {
      lat:  data.GPSLatitude  || null,
      lng:  data.GPSLongitude || null,
      date: data.DateTimeOriginal ? new Date(data.DateTimeOriginal).toISOString().split('T')[0] : null,
    };
  } catch {
    return {};
  }
}
