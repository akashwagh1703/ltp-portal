import api from './api';

export const payoutService = {
  getAll: async (params = {}) => {
    const response = await api.get('/v1/admin/payouts', { params });
    return response.data;
  },

  generate: async (data) => {
    const response = await api.post('/v1/admin/payouts/generate', data);
    return response.data;
  },

  process: async (id) => {
    const response = await api.post(`/v1/admin/payouts/${id}/process`);
    return response.data;
  },

  release: async (id) => {
    const response = await api.post(`/v1/admin/payouts/${id}/release`);
    return response.data;
  },
};
