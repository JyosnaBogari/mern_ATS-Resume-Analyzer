import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getErrorMessage = (err, defaultMessage) => {
  // Backend is stopped / network error / CORS failed
  if (!err.response) {
    return "Server is not responding. Please try again later.";
  }

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    defaultMessage
  );
};

export const useAuth = create((set) => ({
  currentUser: null,
  error: null,
  isAuthenticated: false,
  loading: false,

  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post(
        `${API_URL}/user-api/authenticate`,
        userCredObj,
        { withCredentials: true }
      );

      set({
        loading: false,
        currentUser: res.data.payload,
        isAuthenticated: true,
        error: null,
      });

      return res.data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Invalid email or password."
      );

      set({
        isAuthenticated: false,
        currentUser: null,
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });

      await axios.get(`${API_URL}/user-api/logout`, {
        withCredentials: true,
      });

      set({
        loading: false,
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Logout failed. Please try again."
      );

      set({
        isAuthenticated: false,
        currentUser: null,
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  refreshToken: async () => {
    try {
      const res = await axios.post(
        `${API_URL}/user-api/refresh`,
        {},
        { withCredentials: true }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        error: null,
      });

      return res.data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Session expired. Please login again."
      );

      set({
        isAuthenticated: false,
        currentUser: null,
        error: message,
      });

      throw new Error(message);
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get(`${API_URL}/user-api/check-auth`, {
        withCredentials: true,
      });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        error: null,
      });
    } catch (err) {
      set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));