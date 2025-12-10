import api from './api';

export const reviewService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/admin/reviews/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },
};
