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

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err)
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axios.post('https://sugarnest-api.io.vn/auth/refresh-token', {
          refreshToken: refreshToken
        }).then(res => res.data);

        console.log(`pin ${response}`);

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
