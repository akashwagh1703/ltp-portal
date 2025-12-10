import api from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data || response.data;
  },

  getRecentBookings: async () => {
    const response = await api.get('/admin/dashboard/recent-bookings');
    return response.data.data || response.data;
  },
};
