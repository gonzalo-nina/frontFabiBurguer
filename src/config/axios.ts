// src/config/axios.ts
import axios from 'axios';
import auth from '../service/auth';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor - mantener igual
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

// Response interceptor mejorado
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Error en la operación';

      switch (status) {
        case 401:
          // Solo manejar expiración de token si ya estábamos autenticados
          if (auth.getCurrentUser()?.token) {
            console.log('🔐 Sesión expirada:', message);
            auth.logout();
            toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            window.location.href = '/login';
          }
          break;

        case 403:
          console.log('🚫 Error de autorización:', message);
          alert('No tienes permisos para realizar esta acción.');
          break;

        case 404:
          console.log('❌ Recurso no encontrado:', message);
          alert('El recurso solicitado no existe.');
          break;

        case 400:
          console.log('⚠️ Error de validación:', message);
          alert(`Error en la solicitud: ${message}`);
          break;

        case 500:
          console.log('💥 Error del servidor:', message);
          alert('Error interno del servidor. Por favor, intenta más tarde.');
          break;

        default:
          console.log(`❗ Error ${status}:`, message);
          alert('Ha ocurrido un error. Por favor, intenta más tarde.');
      }
    } else if (error.request) {
      // Error de red - no se recibió respuesta
      console.log('📡 Error de red:', error.message);
      alert('Error de conexión. Por favor, verifica tu conexión a internet.');
    } else {
      // Error en la configuración de la solicitud
      console.log('⚙️ Error de configuración:', error.message);
      alert('Error al procesar la solicitud.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;