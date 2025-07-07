import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/authService'; // Importamos el servicio de autenticación
import { navigationItems } from '@/navigation'; // Importamos la estructura de navegación centralizada

const routes = [
  {
    path: '/', // La ruta raíz ahora usa el layout
    component: () => import('@/layouts/default/Default.vue'), // El componente principal es el layout
    children: [
      // Las rutas del menú de navegación se importan y se esparcen aquí.
      ...navigationItems,
      // Añadimos rutas adicionales que usan el mismo layout pero no están en el menú.
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { requiresAuth: true } // Solo usuarios autenticados pueden ver su perfil
      }
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/blank/Blank.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/Login.vue'), // La página de login
        meta: { guest: true } // Esta ruta es solo para invitados (no autenticados)
      },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global Navigation Guard
// Se ejecuta antes de cada navegación de ruta
router.beforeEach((to, from, next) => {
  // La inicialización ahora se hace en main.js ANTES de que el router se active.
  // Simplemente leemos el estado reactivo que ya fue establecido.
  const isAuthenticated = authService.isAuthenticated.value;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestRoute = to.matched.some(record => record.meta.guest);

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y no la hay, redirigir a login.
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  if (isGuestRoute && isAuthenticated) {
    // Si la ruta es para invitados (login) y ya está autenticado, redirigir a home.
    return next({ name: 'Home' });
  }

  // Si la ruta requiere autenticación (y ya sabemos que está autenticado)
  if (requiresAuth) {
    const requiredRoles = to.meta.roles;
    const user = authService.user.value;
    // Si la ruta requiere roles específicos y el usuario no los tiene,
    // lo redirigimos a la página de inicio.
    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user?.rol)) {
      return next({ name: 'Home' }); // O a una página de error 403 "No Autorizado"
    }
  }

  // Si ninguna de las condiciones anteriores provocó una redirección,
  // permitimos que el usuario continúe a la ruta solicitada.
  next();
});

export default router;
