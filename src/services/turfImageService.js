import api from './api';

export const turfImageService = {
  upload: async (turfId, formData) => {
    const response = await api.post(`/admin/turfs/${turfId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (imageId) => {
    const response = await api.delete(`/admin/turf-images/${imageId}`);
    return response.data;
  },

  setPrimary: async (imageId) => {
    const response = await api.post(`/admin/turf-images/${imageId}/set-primary`);
    return response.data;
  },
};
