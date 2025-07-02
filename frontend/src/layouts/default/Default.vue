<template>
  <v-app>
    <!-- Usamos el componente AppBar que contiene la navegación dinámica y reactiva -->
    <AppBar />

    <v-main>
      <!-- El contenido de cada vista (Home, Pacientes, etc.) se renderiza aquí -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  // Importamos el componente que ahora maneja toda la barra de navegación.
  import AppBar from './AppBar.vue'
</script>