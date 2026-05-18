import { create } from 'zustand';
import apiClient from '../services/apiClient';

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
      const response = await apiClient.post(
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
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to upload resume';
      set({
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  // ✅ Fetch History with better error handling
  fetchResumeHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/resume-api/history");

      set({ resumeHistory: response.data.data || [], loading: false });
      return response.data;
    } catch (error) {
      // Handle session expiration
      if (error.isSessionExpired) {
        set({
          error: 'Your session has expired. Please login again to view your resume history.',
          loading: false
        });
      } else if (error.isUnauthorized) {
        set({
          error: 'Please sign in to access your resume history.',
          loading: false
        });
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Failed to fetch resume history';
        set({
          error: errorMessage,
          loading: false
        });
      }
      throw error;
    }
  },

  // ✅ Analyze Resume
  analyzeResume: async (resumeId, targetRole) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/resume-api/analyze", {
        id: resumeId,
        targetRole
      });

      set({ analysisResults: response.data.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to analyze resume';
      set({
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  // ✅ Download Resume
  downloadResume: async (resumeId) => {
    try {
      const response = await apiClient.get(
        `/resume-api/download/${resumeId}`,
        {
          responseType: "blob"
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
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to download resume';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));