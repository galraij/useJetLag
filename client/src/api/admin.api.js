import api from './axios';
export const getUsers       = ()   => api.get('/admin/users');
export const blockUser      = (id) => api.patch(`/admin/users/${id}/block`);
export const adminDeletePost= (id) => api.delete(`/admin/posts/${id}`);
