import apiClient from './api'; // <-- 1. Importamos el apiClient centralizado.
import { ref } from 'vue';

// 2. El estado del usuario se inicializa como nulo. Ya no dependemos de localStorage.
const user = ref(null);

// Esta promesa evita que se verifique la sesión múltiples veces durante la carga inicial.
let authPromise = null;

/**
 * Inicia sesión. Envía las credenciales como JSON.
 * @param {object} credentials - { nombre_usuario, password }
 */
async function login(credentials) {
  // Usamos el apiClient centralizado. El navegador guardará la cookie de sesión.
  const response = await apiClient.post('/users/login', credentials);

  // Guardamos el usuario en nuestro estado reactivo
  user.value = response.data.user;

  return user.value;
}

/**
 * Cierra la sesión. Llama a la API y limpia el estado local.
 */
async function logout() {
  try {
    // Llama al backend para que destruya la sesión del servidor.
    await apiClient.post('/users/logout');
  } catch (error) {
    console.error("Error en el logout del backend, limpiando sesión local de todas formas.", error);
  } finally {
    // Limpiamos el estado local para que el frontend "olvide" al usuario.
    user.value = null;
  }
}

/**
 * Verifica si el usuario está autenticado.
 */
function isAuthenticated() {
  // La única fuente de verdad es si el objeto 'user' existe en memoria.
  return !!user.value;
}

/**
 * Verifica si hay una sesión activa en el servidor llamando a un endpoint protegido.
 */
async function checkAuthStatus() {
  try {
    // Esta llamada solo tendrá éxito si el navegador tiene una cookie de sesión válida.
    const response = await apiClient.get('/users/profile');
    // La respuesta del perfil anida el usuario, lo asignamos correctamente.
    user.value = response.data.user;
  } catch (error) {
    // Si la llamada falla (ej. error 401), significa que no hay sesión.
    user.value = null;
  }
}

/**
 * Inicializa la autenticación, asegurando que checkAuthStatus se llame solo una vez.
 */
function initializeAuth() {
  if (!authPromise) {
    authPromise = checkAuthStatus();
  }
  return authPromise;
}

/**
 * Actualiza el perfil del usuario enviando los datos como JSON.
 * @param {object} profileData - Los datos del perfil (nombre, apellido, etc.).
 */
async function updateProfile(profileData) {
  // La cabecera 'Content-Type': 'application/json' es la predeterminada para apiClient.
  const response = await apiClient.put('/users/profile', profileData);
  user.value = response.data.user; // Actualizamos el usuario local con la respuesta.
  return response.data;
}

// Exportamos las funciones y el estado para que otros componentes los usen
export default {
  user,
  login,
  logout,
  isAuthenticated,
  initializeAuth,
  updateProfile, // <-- Exportamos la nueva función para actualizar el perfil.
};