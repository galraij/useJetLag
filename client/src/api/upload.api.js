import api from './axios';
export const uploadImages = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return api.post('/upload', form);
};

export const uploadWithExif = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return api.post('/upload/with-exif', form);
};

export const getUploadedPictures = () => {
  return api.get('/upload');
};

export const deletePicture = (id) => {
  return api.delete(`/upload/${id}`);
};
