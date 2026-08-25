import api from './api';

export const notificationService = {
  send: async (data) => {
    const response = await api.post('/admin/notifications/send', data);
    return response.data;
  },

  sendToUser: async (userId, data) => {
    const response = await api.post('/admin/notifications/send-to-user', {
      ...data,
      user_id: userId,
      message: data.message || data.body,
    });
    return response.data;
  },

  sendToAll: async (data) => {
    const response = await api.post('/admin/notifications/send-to-all', data);
    return response.data;
  },

  getHistory: async (params = {}) => {
    const response = await api.get('/admin/notifications/history', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/notifications/stats');
    return response.data;
  }
};