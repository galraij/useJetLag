import { create } from 'zustand';

export const useUploadStore = create((set) => ({
  files:        [],
  exifData:     [],
  imageUrls:    [],
  aiCaption:    '',
  aiTitle:      '',
  locationName: '',
  lat:          null,
  lng:          null,
  dateTaken:    null,
  weather:      null,

  setFiles:     (files)      => set({ files }),
  setExifData:  (exifData)   => set({ exifData }),
  setImageUrls: (imageUrls)  => set({ imageUrls }),
  setAiResult:  (data)       => set({
    aiCaption:    data.captionAi,
    aiTitle:      data.title,
    locationName: data.locationName,
    lat:          data.lat,
    lng:          data.lng,
    dateTaken:    data.dateTaken,
    weather:      data.weather,
  }),
  reset: () => set({
    files: [], exifData: [], imageUrls: [],
    aiCaption: '', aiTitle: '', locationName: '',
    lat: null, lng: null, dateTaken: null, weather: null,
  }),
}));
