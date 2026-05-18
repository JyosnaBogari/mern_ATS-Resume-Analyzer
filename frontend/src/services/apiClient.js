import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send cookies with requests
});

// ✅ Response Interceptor - Handle 401 and 403 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Token expired or invalid
    if (status === 403 && errorData?.error === 'TOKEN_EXPIRED') {
      // Clear any stored auth data
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Redirect to login with message
      window.location.href = '/signin?message=session_expired';
      return Promise.reject({
        ...error,
        message: 'Your session has expired. Please login again.',
        isSessionExpired: true,
      });
    }

    // No token or unauthorized
    if (status === 401 || (status === 403 && errorData?.error === 'NO_TOKEN')) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      window.location.href = '/signin?message=please_login';
      return Promise.reject({
        ...error,
        message: 'Please sign in to access this feature.',
        isUnauthorized: true,
      });
    }

    // Invalid token
    if (status === 403 && errorData?.error === 'INVALID_TOKEN') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      window.location.href = '/signin?message=invalid_session';
      return Promise.reject({
        ...error,
        message: 'Your session is invalid. Please login again.',
        isInvalidToken: true,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
