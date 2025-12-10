import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/admin/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.get('/admin/me');
    return response.data;
  },
};
