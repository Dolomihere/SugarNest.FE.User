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

const PUBLIC_ROUTES = ['/auth/signup', '/auth/signin', '/categories/sellable', '/products/sellable'];

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(serverApi(originalRequest));
            },
            reject: (err) => reject(err)
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post('https://sugarnest-api.io.vn/auth/refresh-token', {
          refreshToken
        });
        const { accessToken, refreshToken: newRefreshToken } = res.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return serverApi(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        const attemptedPath = window.location.pathname + window.location.search;
        localStorage.setItem('lastAccessPath', attemptedPath);
        window.location.href = '/auth/signin';

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
