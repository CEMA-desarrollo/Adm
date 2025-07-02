import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/authService'; // Importamos el servicio de autenticación

const routes = [
  {
    path: '/', // La ruta raíz ahora usa el layout
    component: () => import('@/layouts/default/Default.vue'), // El componente principal es el layout
    children: [
      {
        path: '', // La ruta hija vacía (la raíz '/')
        name: 'Home', // Nombre de la ruta
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        meta: { requiresAuth: true } // Esta ruta requiere autenticación
      },
      {
        path: 'pacientes',
        name: 'Pacientes',
        component: () => import('@/views/Pacientes.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'proveedores',
        name: 'Proveedores',
        component: () => import('@/views/Proveedores.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'servicios',
        name: 'Servicios',
        component: () => import('@/views/Servicios.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tratamientos',
        name: 'Tratamientos',
        component: () => import('@/views/Tratamientos.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'especialidades',
        name: 'Especialidades',
        component: () => import('@/views/Especialidades.vue'),
        meta: { requiresAuth: true, roles: ['Administrador'] } // Solo para administradores
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: () => import('@/views/Usuarios.vue'),
        meta: { requiresAuth: true, roles: ['Administrador'] } // Solo para administradores
      },
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
router.beforeEach(async (to, from, next) => {
  // 1. Antes de cualquier otra cosa, nos aseguramos de que el estado de autenticación
  //    se haya verificado con el backend. Esto solo hará una llamada a la API
  //    la primera vez que se cargue la página.
  await authService.initializeAuth();

  const isAuthenticated = authService.isAuthenticated();

  // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir a login
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      console.log('Redirigiendo a login: Ruta protegida y usuario no autenticado.');
      next({ name: 'Login', query: { redirect: to.fullPath } }); // Redirige a login, guardando la ruta original en el query
    } else {
      // El usuario está autenticado, ahora verificamos los roles
      const requiredRoles = to.meta.roles;
      const user = authService.user.value; // Obtenemos el usuario reactivo

      if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user.rol)) {
        next({ name: 'Home' }); // Redirigir a Home si no tiene el rol requerido
      } else {
        next(); // Permitir acceso
      }
    }
  }
  // Si la ruta es solo para invitados (ej. login) y el usuario ya está autenticado, redirigir a home
  else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      console.log('Redirigiendo a home: Usuario autenticado intentando acceder a página de invitado.');
      next({ name: 'Home' }); // Usuario autenticado, redirigir a home
    } else {
      next(); // Usuario no autenticado, permitir acceso a la página de invitado
    }
  }
  // Para cualquier otra ruta que no tenga metadatos específicos, permitir acceso
  else {
    next();
  }
});

export default router;
