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

  getEnhancedStats: async () => {
    const response = await api.get('/admin/dashboard/enhanced-stats');
    return response.data.data || response.data;
  },

  getPendingActions: async () => {
    const response = await api.get('/admin/dashboard/pending-actions');
    return response.data.data || response.data;
  },

  getRevenueChart: async (period = '7d') => {
    const response = await api.get(`/admin/dashboard/revenue-chart?period=${period}`);
    return response.data.data || response.data;
  },

  getTopTurfs: async () => {
    const response = await api.get('/admin/dashboard/top-turfs');
    return response.data.data || response.data;
  }
};
