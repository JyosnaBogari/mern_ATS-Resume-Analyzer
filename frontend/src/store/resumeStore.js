import { create } from 'zustand';
import axios from 'axios';

// ✅ Create axios instance (BEST PRACTICE)
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true // 🔥 important for cookies
});

export const useResumeStore = create((set, get) => ({
  currentResume: null,
  resumeHistory: [],
  analysisResults: null,
  loading: false,
  error: null,

  // Actions
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setResumeHistory: (history) => set({ resumeHistory: history }),
  setAnalysisResults: (results) => set({ analysisResults: results }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // ✅ Upload Resume
  uploadResume: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        "/resume-api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      set({ currentResume: response.data.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // ✅ Fetch History
  fetchResumeHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/resume-api/history");

      set({ resumeHistory: response.data.data || [], loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // ✅ Analyze Resume
  analyzeResume: async (resumeId, targetRole) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/resume-api/analyze", {
        id: resumeId,
        targetRole
      });

      set({ analysisResults: response.data.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // ✅ Download Resume
  downloadResume: async (resumeId) => {
    try {
      const response = await api.get(
        `/resume-api/download/${resumeId}`,
        {
          responseType: "blob" // 🔥 important
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `improved-resume-${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));