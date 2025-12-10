import api from './api';

export const turfUpdateRequestService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/turf-update-requests', { params });
    return response.data;
  },

  approve: async (id) => {
    const response = await api.post(`/admin/turf-update-requests/${id}/approve`);
    return response.data;
  },

  reject: async (id, data) => {
    const response = await api.post(`/admin/turf-update-requests/${id}/reject`, data);
    return response.data;
  },
};
