import api from './api';

export const bookingService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await api.post(`/admin/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};
