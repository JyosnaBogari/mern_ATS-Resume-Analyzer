import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/user-api';

export const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, { withCredentials: true });
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/authenticate`, credentials, { withCredentials: true });
    return response.data;
  },

  logout: async () => {
    const response = await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axios.put(`${API_BASE_URL}/change-password`, passwordData, { withCredentials: true });
    return response.data;
  },

  refreshToken: async () => {
    // Assuming backend has a refresh endpoint
    const response = await axios.post(`${API_BASE_URL}/refresh`, {}, { withCredentials: true });
    return response.data;
  }
};