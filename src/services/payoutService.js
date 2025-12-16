import api from './api';

export const payoutService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/payouts', { params });
    return response.data.data ? response.data : { data: response.data };
  },

  generate: async (data) => {
    const response = await api.post('/admin/payouts/generate', data);
    return response.data;
  },

  process: async (id) => {
    const response = await api.post(`/admin/payouts/${id}/process`);
    return response.data;
  },

  release: async (id) => {
    const response = await api.post(`/admin/payouts/${id}/release`);
    return response.data;
  },
};
