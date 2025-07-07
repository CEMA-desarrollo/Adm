<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <!-- Hacemos que el bloque de perfil sea un enlace a la página de perfil -->
      <v-list-item
        :title="userName"
        :subtitle="userRole"
        :to="{ name: 'Profile' }"
        link
      >
        <template v-slot:prepend>
          <v-avatar color="grey-darken-1">
            <v-img v-if="userAvatarUrl" :src="userAvatarUrl" :alt="userName"></v-img>
            <v-icon v-else color="white">mdi-account</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <!-- Iteramos sobre los items de navegación FILTRADOS por rol -->
      <v-list-item
        v-for="item in visibleNavItems"
        :key="item.name"
        :prepend-icon="item.icon"
        :title="item.name"
        :to="{ name: item.name }"
        link
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <!-- Reemplazamos el botón por un v-list-item.
           Este componente se adapta automáticamente al estado colapsado (rail)
           mostrando solo el ícono, y el texto cuando está expandido. -->
      <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" @click="logout">
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import { navigationItems } from '@/navigation'; // Importamos la misma fuente de verdad

const router = useRouter();

// Obtenemos el usuario y su rol del servicio de autenticación
const user = authService.user;
const userRole = computed(() => user.value?.rol || 'Invitado');
// Corregido para usar `nombre_usuario` que sí existe en el objeto de usuario.
const userName = computed(() => user.value?.nombre_usuario || 'Usuario');

// Lógica de avatar mejorada
const userAvatarUrl = computed(() => {
  // La tabla de usuarios no tiene url_imagen, nombre, o apellido.
  // Usamos `nombre_usuario` para generar un avatar de fallback.
  if (user.value?.nombre_usuario) {
    return `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user.value.nombre_usuario)}`;
  }
  // 3. Si no hay datos, no devolvemos URL para mostrar un ícono de fallback.
  return null;
});

/**
 * @summary Filtra los items de navegación basados en el rol del usuario.
 * @description Esta es la lógica clave para OCULTAR los enlaces.
 * - Si un item no tiene `meta.roles`, es visible para todos los usuarios autenticados.
 * - Si un item tiene `meta.roles`, solo es visible si el rol del usuario está en esa lista.
 */
const visibleNavItems = computed(() => {
  // Si no hay usuario autenticado, no mostramos ningún item.
  if (!user.value) return [];
  
  const currentUserRole = userRole.value.toLowerCase();
  return navigationItems.filter(item => {
    if (!item.meta?.roles || item.meta.roles.length === 0) {
      return true; // Visible para todos si no se especifican roles
    }
    // Hacemos la comprobación insensible a mayúsculas para que sea robusta.
    return item.meta.roles.some(requiredRole => requiredRole.toLowerCase() === currentUserRole);
  });
});

const logout = async () => {
  await authService.logout();
  router.push({ name: 'Login' });
};
</script>