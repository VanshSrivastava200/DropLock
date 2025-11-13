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

export const authorityVerificationService = {
  async getPendingRequests() {
    try {
      const response = await api.get('/authority/verification/pending-requests');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch pending requests');
    }
  },

  async verifyDocument(documentId, file) {
    try {
      // Convert file to buffer for hash comparison
      const fileBuffer = await file.arrayBuffer();
      
      const response = await api.post(`/authority/verification/verify/${documentId}`, fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Verification failed');
    }
  },

  async getVerificationHistory() {
    try {
      const response = await api.get('/authority/verification/verification-history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch verification history');
    }
  },

  async getStats() {
    try {
      const response = await api.get('/authority/verification/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  }
};

export default authorityVerificationService;