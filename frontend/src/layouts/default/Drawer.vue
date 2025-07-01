<template>
  <v-navigation-drawer> <!-- v-model es manejado por el componente padre -->
    <v-list-item
      prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
      title="Usuario Admin"
      subtitle="admin@sigfac.com"
      class="py-2"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="home" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group" title="Pacientes" value="pacientes" to="/pacientes"></v-list-item>
      <v-list-item prepend-icon="mdi-store" title="Proveedores" value="proveedores" to="/proveedores"></v-list-item>
      <v-list-item prepend-icon="mdi-pill" title="Servicios" value="servicios" to="/servicios"></v-list-item>
      <v-list-item prepend-icon="mdi-cash-multiple" title="Tratamientos" value="tratamientos" to="/tratamientos"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
// No se necesita script ya que v-model se maneja desde el padre.
</script>