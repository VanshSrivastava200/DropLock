import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authorityToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authorityAuthService = {
  async register(authorityData) {
    try {
      const response = await api.post('/authority/auth/register', authorityData);
      if (response.data.success) {
        localStorage.setItem('authorityToken', response.data.token);
        localStorage.setItem('authority', JSON.stringify(response.data.authority));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/authority/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('authorityToken', response.data.token);
        localStorage.setItem('authority', JSON.stringify(response.data.authority));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/authority/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  },

  logout() {
    localStorage.removeItem('authorityToken');
    localStorage.removeItem('authority');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authorityToken');
  },

  getCurrentAuthority() {
    const authorityStr = localStorage.getItem('authority');
    return authorityStr ? JSON.parse(authorityStr) : null;
  }
};

export default authorityAuthService;