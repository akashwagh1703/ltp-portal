import api from './api';

export const settingService = {
  getAll: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  update: async (key, data) => {
    const response = await api.put(`/admin/settings/${key}`, data);
    return response.data;
  },

  updateBulk: async (settings) => {
    const response = await api.post('/admin/settings', { settings });
    return response.data;
  },
};
