import api from './api';

export const couponService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/coupons', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/coupons/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/admin/coupons', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/admin/coupons/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response.data;
  },
};
