<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app permanent>
      <v-list-item>
        <v-list-item-title class="text-h6">
          SIGFAC
        </v-list-item-title>
        <v-list-item-subtitle>
          Menú Principal
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        
        <v-list-subheader>Módulos Principales</v-list-subheader>
        <v-list-item prepend-icon="mdi-account-group" title="Pacientes" to="/pacientes"></v-list-item>
        <v-list-item prepend-icon="mdi-truck-delivery" title="Proveedores" to="/proveedores"></v-list-item>
        <v-list-item prepend-icon="mdi-handshake" title="Servicios" to="/servicios"></v-list-item>
        <v-list-item prepend-icon="mdi-medical-bag" title="Tratamientos" to="/tratamientos"></v-list-item>

        <v-list-subheader>Administración</v-list-subheader>
        <v-list-item prepend-icon="mdi-account-multiple" title="Usuarios" to="/usuarios"></v-list-item>
        
        <!-- Elemento del menú para Especialidades -->
        <v-list-item
          prepend-icon="mdi-tag-multiple"
          title="Especialidades"
          to="/especialidades"
        ></v-list-item>

      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Sistema de Gestión</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

const drawer = ref(true);
const router = useRouter();

const logout = async () => {
  try {
    await authService.logout();
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>