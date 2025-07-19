import axios from "axios";
import { getAccessToken, logout, refreshToken } from "./AuthService";

const AxiosInstance = axios.create({
  baseURL: "http://14.225.218.217:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to requests
AxiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors and refresh token
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return AxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }

      logout();
      window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return Promise.reject(error);
    }

    const msg = error.response?.data?.message?.toLowerCase?.();
    if (msg?.includes("unauthorized") || msg?.includes("login required")) {
      logout();
      window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;