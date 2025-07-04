<template>
  <router-view />
</template>
<script setup>
import { onMounted } from 'vue';
import authService from '@/services/authService';

onMounted(async () => {
  // Cada vez que la aplicación se carga (o se refresca la página),
  // verificamos la sesión con el backend.
  await authService.initializeAuth();
});
</script>
