import api from './api';

export const logService = {
  getActivityLogs: async (params = {}) => {
    const response = await api.get('/admin/logs/activity', { params });
    return response.data;
  },
};
