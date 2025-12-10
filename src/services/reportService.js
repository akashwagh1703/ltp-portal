import api from './api';

export const reportService = {
  getBookings: async (params = {}) => {
    const response = await api.get('/admin/reports/bookings', { params });
    return response.data;
  },

  getTurfWise: async (params = {}) => {
    const response = await api.get('/admin/reports/turf-wise', { params });
    return response.data;
  },

  getOwnerWise: async (params = {}) => {
    const response = await api.get('/admin/reports/owner-wise', { params });
    return response.data;
  },

  getPaymentMode: async (params = {}) => {
    const response = await api.get('/admin/reports/payment-mode', { params });
    return response.data;
  },
};
