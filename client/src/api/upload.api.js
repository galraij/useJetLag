import api from './axios';
export const uploadImages = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const uploadWithExif = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return api.post('/upload/with-exif', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const getUploadedPictures = () => {
  return api.get('/upload/with-exif');
};
