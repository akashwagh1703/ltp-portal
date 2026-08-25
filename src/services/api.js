import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required. Set it in ltp-portal/.env (see .env.example).');
}

function unsetContentType(headers) {
  if (!headers) return;
  if (typeof headers.delete === 'function') {
    headers.delete('Content-Type');
    headers.delete('content-type');
    return;
  }
  delete headers['Content-Type'];
  delete headers['content-type'];
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    unsetContentType(config.headers);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
