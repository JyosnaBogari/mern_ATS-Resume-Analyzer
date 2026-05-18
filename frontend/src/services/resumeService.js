import apiClient from './apiClient';

const API = 'resume-api';

export const resumeService = {
  generateResume: async (resumeData) => {
    const response = await apiClient.post(`/${API}/generate`, resumeData, {
      responseType: 'blob',
    });
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await apiClient.get(`/${API}/get/${id}`);
    return response.data.data;
  },

  updateResume: async (id, updateData) => {
    const response = await apiClient.put(`/${API}/update/${id}`, updateData);
    return response.data.payload;
  },

  // ✅ Fetch resume history with error handling
  fetchResumeHistory: async () => {
    const response = await apiClient.get(`/${API}/history`);
    return response.data;
  },

  // ✅ Delete resume
  deleteResume: async (id) => {
    const response = await apiClient.delete(`/${API}/delete/${id}`);
    return response.data;
  },

  // ✅ Upload resume with proper error handling
  uploadResume: async (formData) => {
    const response = await apiClient.post(`/${API}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

