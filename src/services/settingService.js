import api from './api';

export const settingService = {
  getAll: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  update: async (settings) => {
    const response = await api.post('/admin/settings', { settings });
    return response.data;
  },

  updateSingle: async (key, value) => {
    const response = await api.put(`/admin/settings/${key}`, { value });
    return response.data;
  },

  getCommissionRate: async () => {
    const response = await api.get('/admin/settings/commission/rate');
    return response.data;
  },

  updateCommissionRate: async (rate) => {
    const response = await api.put('/admin/settings/commission/rate', { rate });
    return response.data;
  },
};
