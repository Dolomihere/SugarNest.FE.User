import axios from "axios";
import { getAccessToken, logout, refreshToken } from "./AuthService";

const AxiosInstance = axios.create({
  baseURL: "https://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn access token trước mỗi request
AxiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Tự động refresh token nếu gặp 401
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu là 401 và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return AxiosInstance(originalRequest); // 👈 Retry request với token mới
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }

      // 👉 Nếu không thể refresh hoặc refresh lỗi → logout & chuyển đến login
      logout();
      window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return Promise.reject(error);
    }

    // 👉 Nếu là lỗi 403 hoặc lỗi tùy chỉnh yêu cầu đăng nhập
    const msg = error.response?.data?.message?.toLowerCase?.();
    if (msg?.includes("unauthorized") || msg?.includes("login required")) {
      logout();
      window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(error);
  }
);
export default AxiosInstance;