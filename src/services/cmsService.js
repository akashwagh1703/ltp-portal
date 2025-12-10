import api from './api';

export const cmsService = {
  getBanners: async () => {
    const response = await api.get('/admin/banners');
    return response.data;
  },

  createBanner: async (data) => {
    const response = await api.post('/admin/banners', data);
    return response.data;
  },

  updateBanner: async (id, data) => {
    const response = await api.put(`/admin/banners/${id}`, data);
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await api.delete(`/admin/banners/${id}`);
    return response.data;
  },

  getFaqs: async () => {
    const response = await api.get('/admin/faqs');
    return response.data;
  },

  createFaq: async (data) => {
    const response = await api.post('/admin/faqs', data);
    return response.data;
  },

  updateFaq: async (id, data) => {
    const response = await api.put(`/admin/faqs/${id}`, data);
    return response.data;
  },

  deleteFaq: async (id) => {
    const response = await api.delete(`/admin/faqs/${id}`);
    return response.data;
  },
};
