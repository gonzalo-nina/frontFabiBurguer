// src/config/axios.ts
import axios from 'axios';
import auth from '../service/auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
});

// Interceptor para añadir el token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const user = auth.getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autorización
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;