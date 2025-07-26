// src/api/axiosInstance.ts
import axios from 'axios';
// import { store } from '../store/store';
// import { refreshToken, logout } from '../modules/auth/features/authSlice';

const API_BASE_URL = 'http://localhost:5000/api';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = store.getState().auth.accessToken;
//     if (token && config.headers) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to refresh token
// axiosInstance.interceptors.response.use(
//   (response) => response, async (error) => {

//     console.log("interceptor");

//     const originalRequest = error.config;

//     if ( error.response?.status === 401 && !originalRequest._retry && error.response.data.message === 'Invalid or expired token!') {
//       originalRequest._retry = true;
//       try {
//         const refresh_Token = store.getState().auth.refreshToken;

//         const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refreshToken: refresh_Token
//         }, { withCredentials: true });
//         const newToken = response.data.accessToken;

//         store.dispatch(refreshToken(newToken));
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

//         return axiosInstance(originalRequest);
//       } catch (err) {
//         store.dispatch(logout());
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store in-memory access token


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(localStorage.getItem('accessToken'));
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {refreshToken: refreshToken}, {
          withCredentials: true
        });

        const newToken = response.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        processQueue(null, newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/signin';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;