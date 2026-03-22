import api from './axios';
export const uploadImages = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
