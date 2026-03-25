import api from './axios';

export const getTripBySlug = (slug) => {
  return api.get(`/trips/${slug}`);
};

export const updateTripTitle = (slug, title) => {
  return api.put(`/trips/${slug}`, { title });
};

export const generateTripStory = (slug) => {
  return api.post(`/trips/${slug}/generate-story`);
};
