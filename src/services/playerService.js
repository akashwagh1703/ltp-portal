import api from './api';

export const playerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/players', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/players/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/admin/players/${id}/status`, { status });
    return response.data;
  },
};
