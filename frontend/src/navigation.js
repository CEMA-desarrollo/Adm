// d:\Code\Adm\frontend\src\navigation.js

/**
 * @summary Define la estructura de navegación de la aplicación.
 * @description Este archivo es la única fuente de verdad para las rutas y los enlaces del menú.
 * Cada objeto contiene la información para el router de Vue y metadatos adicionales para la UI (como iconos).
 */
export const navigationItems = [
  {
    path: '',
    name: 'Home',
    icon: 'mdi-home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'pacientes',
    name: 'Pacientes',
    icon: 'mdi-account-group',
    component: () => import('@/views/Pacientes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'proveedores',
    name: 'Proveedores',
    icon: 'mdi-truck-delivery',
    component: () => import('@/views/Proveedores.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'servicios',
    name: 'Servicios',
    icon: 'mdi-medical-bag',
    component: () => import('@/views/Servicios.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'tratamientos',
    name: 'Tratamientos',
    icon: 'mdi-stethoscope',
    component: () => import('@/views/Tratamientos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'especialidades',
    name: 'Especialidades',
    icon: 'mdi-star-box',
    component: () => import('@/views/Especialidades.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] }
  },
  {
    path: 'usuarios',
    name: 'Usuarios',
    icon: 'mdi-account-cog',
    component: () => import('@/views/Usuarios.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] }
  },
];