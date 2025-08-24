// src/configs/AxiosConfig.js
import axios from "axios";

export const publicApi = axios.create({
  baseURL: "https://sugarnest-api.io.vn/",
  headers: { "Content-Type": "application/json" },
});

export const privateApi = axios.create({
  baseURL: "https://sugarnest-api.io.vn/",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Request Interceptor: luôn gắn accessToken
privateApi.interceptors.request.use((config) => {
  if (config.skipAuth) return config;

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response Interceptor: refresh token nếu 401
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chặn loop nếu chính request refresh-token cũng fail
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return privateApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await publicApi.post("/auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = response.data?.data?.accessToken;
        if (!newAccessToken) throw new Error("Không lấy được accessToken mới");

        localStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 👉 redirect login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
