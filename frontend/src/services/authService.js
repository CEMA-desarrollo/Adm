import { ref, readonly } from 'vue';
import router from '@/router';
import apiClient from './api'; // Usamos nuestra instancia de axios configurada

// --- Estado Reactivo ---
// Usamos un prefijo `_` para indicar que no deben ser modificados directamente desde fuera.
const _user = ref(null);
const _isAuthenticated = ref(false); // La única fuente de verdad sobre el estado de la sesión

/**
 * Inicia sesión. Envía las credenciales como JSON.
 * @param {object} credentials - { nombre_usuario, password }
 */
async function login(credentials) {
  const response = await apiClient.post('/users/login', credentials);
  if (response.data && response.data.user) {
    _user.value = response.data.user;
    _isAuthenticated.value = true;
  }
  return response.data;
}

/**
 * Cierra la sesión. Llama a la API y limpia el estado local.
 */
async function logout() {
  await apiClient.post('/users/logout');
  // Limpiamos el estado local para que el frontend "olvide" al usuario.
  _user.value = null;
  _isAuthenticated.value = false;
  // Redirigimos al login después de cerrar sesión.
  await router.push({ name: 'Login' });
}

/**
 * Verifica si hay una sesión activa en el backend al cargar la aplicación.
 * Esta función es la única fuente de verdad al iniciar la app.
 * Se llama desde main.js ANTES de montar la aplicación.
 */
async function initializeAuth() {
  try {
    // **Nota:** Asegúrate de tener este endpoint en tu backend.
    // Debe ser una ruta protegida que devuelva los datos del usuario si la sesión es válida.
    // Ejemplo de respuesta exitosa: { user: { id: 1, nombre_usuario: 'admin', rol: 'Administrador' } }
    const response = await apiClient.get('/users/check-session');
    if (response.data && response.data.user) {
      _user.value = response.data.user;
      _isAuthenticated.value = true;
    }
  } catch (error) {
    // Si hay un error (ej. 401), significa que no hay sesión válida.
    _user.value = null;
    _isAuthenticated.value = false;
  }
}

// Exportamos las funciones y el estado (como solo lectura) para que otros componentes los usen
export default {
  user: readonly(_user),
  isAuthenticated: readonly(_isAuthenticated), // Exponemos el estado de autenticación
  login,
  logout,
  initializeAuth,
};