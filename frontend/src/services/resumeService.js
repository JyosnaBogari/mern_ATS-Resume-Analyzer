import axios from 'axios';

const API = 'http://localhost:3000/resume-api';

export const resumeService = {
  generateResume: async (resumeData) => {
    const response = await axios.post(`${API}/generate`, resumeData, {
      responseType: 'blob',
      withCredentials: true,
    });
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await axios.get(`${API}/get/${id}`, {
      withCredentials: true,
    });
    return response.data.data;
  },

  updateResume: async (id, updateData) => {
    const response = await axios.put(`${API}/update/${id}`, updateData, {
      withCredentials: true,
    });
    return response.data.payload;
  },
};
