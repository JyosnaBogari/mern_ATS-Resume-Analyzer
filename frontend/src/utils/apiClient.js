import axios from 'axios';
import { authService } from '../services/authService';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add any additional headers if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await authService.refreshToken();
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;