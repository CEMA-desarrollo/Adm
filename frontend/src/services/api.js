import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // URL base de tu API
  withCredentials: true, // ¡LA CLAVE! Permite que axios envíe y reciba cookies de sesión.
  headers: {
    'Content-Type': 'application/json',
  },
});

// El interceptor de petición se elimina. Ya no necesitamos añadir tokens manualmente.
// El navegador gestionará la cookie de sesión automáticamente gracias a `withCredentials: true`.

// Opcional pero recomendado: Interceptor de Respuesta para manejar errores 401 globalmente
// Si el token expira, esto deslogueará al usuario automáticamente.

axios.defaults.withCredentials = true;

export default apiClient;