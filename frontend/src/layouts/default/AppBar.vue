<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
    <v-app-bar-title>
      <v-icon icon="mdi-finance" class="mr-2" />
      SIGFAC
    </v-app-bar-title>
    <v-spacer></v-spacer>

    <div v-if="auth.user.value" class="text-right">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="primary" size="large">
              <span class="text-h5">{{ auth.user.value.nombre_usuario.charAt(0).toUpperCase() }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :title="auth.user.value.nombre_usuario" :subtitle="auth.user.value.rol">
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Cerrar Sesión">
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import auth from '@/services/authService';

defineEmits(['toggle-drawer']);

const router = useRouter();

const handleLogout = async () => {
  await auth.logout();
  await router.push({ name: 'Login' });
};
</script>
