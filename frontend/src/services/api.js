import axios from 'axios';

const apiClient = axios.create({
  // Es una buena práctica usar variables de entorno para la URL base.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // ¡Crucial! Permite que axios envíe y reciba cookies de sesión.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Respuesta para manejar errores 401 globalmente.
// Si una petición falla por autenticación (sesión expirada), esto redirigirá al login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && window.location.pathname !== '/login') {
      console.error("Error 401: No autorizado o sesión expirada. Redirigiendo al login.");
      // 1. Forzamos la redirección.
      window.location.href = '/login';
      // 2. Detenemos la cadena de promesas para evitar que el error se propague
      //    después de haber manejado la redirección.
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default apiClient;