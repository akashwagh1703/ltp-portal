import api from './api';

export const subscriptionService = {
  getAll: (params) => api.get('/admin/subscriptions', { params }),
  create: (data) => api.post('/admin/subscriptions', data),
  renew: (id, data) => api.post(`/admin/subscriptions/${id}/renew`, data),
  getPlans: () => api.get('/admin/subscriptions/plans'),
  updatePlan: (id, data) => api.put(`/admin/subscriptions/plans/${id}`, data),
  getOwnersWithout: () => api.get('/admin/subscriptions/owners-without'),
  getStatistics: () => api.get('/admin/subscriptions/statistics'),
  getFeePayments: (params) => api.get('/admin/subscription-payments', { params }),
  confirmFee: (id, data = {}) => api.post(`/admin/subscription-payments/${id}/confirm`, data),
  rejectFee: (id, data = {}) => api.post(`/admin/subscription-payments/${id}/reject`, data),
};
