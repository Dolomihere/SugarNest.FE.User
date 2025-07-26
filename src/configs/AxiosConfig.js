import axios from 'axios';

// docker https://localhost:5001/api
// http ubuntu server http://14.225.218.217:5000
// https ubuntu server https://sugarnest-api.io.vn/

export const serverApi = axios.create({
  baseURL: 'https://sugarnest-api.io.vn'
});

export const dockerApi = axios.create({
  baseURL: 'https://localhost:5001/api'
});

// add more route that no need token here
const PUBLIC_ROUTES = ['/auth/signup', '/auth/signin', '/categories/sellable', '/products/sellable'];

// interchanging api / process request
serverApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const isPublic = PUBLIC_ROUTES.some((route) =>
    config.url?.startsWith(route)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// process response
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

serverApi.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axios.post('/auth/refresh', { refreshToken });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid or tampered
        if (
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403 ||
          refreshError.response?.status === 404
        ) {
          // 🧹 Clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          const attemptedPath = window.location.pathname + window.location.search;
          localStorage.setItem('lastAccessPath', attemptedPath);

          window.location.href = '/auth/signin'; // Or use router.push('/login') in React
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
