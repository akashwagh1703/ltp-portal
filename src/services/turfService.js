import api from './api';

export const turfService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/turfs', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/turfs/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/admin/turfs', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.post(`/admin/turfs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/turfs/${id}`);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.post(`/admin/turfs/${id}/approve`);
    return response.data;
  },

  reject: async (id, data) => {
    const response = await api.post(`/admin/turfs/${id}/reject`, data);
    return response.data;
  },

  suspend: async (id, data) => {
    const response = await api.post(`/admin/turfs/${id}/suspend`, data);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.post(`/admin/turfs/${id}/activate`);
    return response.data;
  },

  toggleFeatured: async (id) => {
    const response = await api.post(`/admin/turfs/${id}/toggle-featured`);
    return response.data;
  },
};
