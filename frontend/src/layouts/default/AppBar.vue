<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <!-- Hacemos que el bloque de perfil sea un enlace a la página de perfil -->
      <v-list-item
        :title="userFullName"
        :subtitle="userRole"
        :to="{ name: 'Profile' }"
        link
      >
        <template v-slot:prepend>
          <v-avatar color="grey-darken-1">
            <v-img v-if="userAvatarUrl" :src="userAvatarUrl" :alt="userFullName"></v-img>
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
const userFullName = computed(() => user.value ? `${user.value.nombre} ${user.value.apellido}` : 'Usuario');

// Lógica de avatar mejorada
const userAvatarUrl = computed(() => {
  // 1. Si el usuario tiene una imagen personalizada, la usamos.
  if (user.value?.url_imagen) {
    return user.value.url_imagen;
  }
  // 2. Si no, generamos una con el nombre de usuario.
  if (user.value?.nombre) {
    const fullName = `${user.value.nombre} ${user.value.apellido || ''}`.trim();
    return `https://avatar.iran.liara.run/username?username=${encodeURIComponent(fullName)}`;
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
  return navigationItems.filter(item => {
    if (!item.meta.roles || item.meta.roles.length === 0) {
      return true; // Visible para todos si no se especifican roles
    }
    return item.meta.roles.includes(userRole.value); // Visible solo si el rol coincide
  });
});

const logout = async () => {
  await authService.logout();
  router.push({ name: 'Login' });
};
</script>