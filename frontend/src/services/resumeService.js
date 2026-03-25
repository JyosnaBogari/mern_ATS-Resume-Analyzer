import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/resume-api';

export const resumeService = {
  uploadResume: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      withCredentials: true,
      // NOTE: Let the browser set the Content-Type including the boundary
    });
    return response.data;
  },

  getResumeHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/history`, { withCredentials: true });
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { withCredentials: true });
    return response.data;
  },

  analyzeResume: async (id, targetRole) => {
    const response = await axios.post(`${API_BASE_URL}/analyze`, { id, targetRole }, { withCredentials: true });
    return response.data;
  },

  downloadResume: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/download/${id}`, {
      withCredentials: true,
      responseType: 'blob'
    });
    return response.data;
  }
};