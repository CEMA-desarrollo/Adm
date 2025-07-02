<template>
  <v-container>
    <v-card>
      <!-- Encabezado ajustado al estilo de Pacientes.vue -->
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-account-cog"></v-icon> &nbsp;
        Gestión de Usuarios

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          density="compact"
          label="Buscar usuario..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>

        <v-btn color="primary" class="ml-4" @click="openDialog()">Nuevo Usuario</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        class="elevation-1"
        loading-text="Cargando usuarios..."
        no-data-text="No se encontraron usuarios."
      >
        <!-- Columna para mostrar Avatar y Nombre Completo -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" class="mr-3">
              <!-- Lógica de avatar mejorada para cada item de la lista -->
              <v-img 
                :src="item.url_imagen || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(item.nombre + ' ' + (item.apellido || ''))}`" 
                :alt="`${item.nombre} ${item.apellido}`"></v-img>
            </v-avatar>
            <span>{{ item.nombre }} {{ item.apellido }}</span>
          </div>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="item.activo ? 'green' : 'red'" dark>{{ item.activo ? 'Activo' : 'Inactivo' }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="mr-2" @click="openDialog(item)" title="Editar Usuario">mdi-pencil</v-icon>
          <!-- La eliminación de usuarios podría necesitar una lógica más compleja (desactivación) -->
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogo para Crear/Editar Usuario -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form" @submit.prevent="save">
              <v-row>
                <!-- Nuevos campos: Nombre y Apellido -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.nombre"
                    label="Nombre"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.apellido"
                    label="Apellido"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.nombre_usuario"
                    label="Nombre de Usuario"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.url_imagen"
                    label="URL de la Foto de Perfil"
                    prepend-icon="mdi-image"
                  ></v-text-field>
                </v-col>
                <!-- Nuevo campo: Fecha de Nacimiento con Date Picker -->
                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="formattedDate"
                        label="Fecha de Nacimiento"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="props"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem.fecha_nacimiento"
                      @update:modelValue="dateMenu = false"
                      :max="(new Date()).toISOString().split('T')[0]"
                      title="Fecha de Nacimiento"
                      color="primary"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" v-if="!editedItem.id">
                  <v-text-field
                    v-model="editedItem.password"
                    label="Contraseña"
                    type="password"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.rol"
                    :items="['Administrador', 'Recepción', 'Encargado', 'Propietario']"
                    label="Rol"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" v-if="editedItem.id">
                  <v-switch
                    v-model="editedItem.activo"
                    label="Activo"
                    color="success"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import userService from '@/services/userService';

const users = ref([]);
const loading = ref(true);
const dialog = ref(false);
const dateMenu = ref(false); // Para controlar el menú del date picker
const search = ref('');
const form = ref(null);

const headers = [
  { title: 'Nombre Completo', key: 'nombre' },
  { title: 'Usuario', key: 'nombre_usuario' },
  { title: 'Rol', key: 'rol' },
  { title: 'Estado', key: 'activo' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const rules = {
  required: value => !!value || 'Este campo es requerido.',
};

const editedItem = ref({
  id: null,
  nombre: '',
  apellido: '',
  fecha_nacimiento: null,
  nombre_usuario: '',
  password: '',
  rol: 'Recepción', // Corregido para coincidir con las opciones del select
  activo: true,
  url_imagen: '',
});

const defaultItem = {
  id: null,
  nombre: '',
  apellido: '',
  fecha_nacimiento: null,
  nombre_usuario: '',
  password: '',
  rol: 'Recepción', // Corregido para coincidir con las opciones del select
  activo: true,
  url_imagen: '',
};

const formTitle = computed(() => (editedItem.value.id ? 'Editar Usuario' : 'Nuevo Usuario'));

const formattedDate = computed(() => {
  if (!editedItem.value.fecha_nacimiento) return null;
  // Asumimos que fecha_nacimiento es un objeto Date
  return new Date(editedItem.value.fecha_nacimiento).toLocaleDateString('es-ES');
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await userService.getAll();
    users.value = response.data;
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  if (item) {
    // Si es un item existente, lo clonamos para edición
    editedItem.value = { 
      ...item, 
      activo: !!item.activo,
      // Formatear la fecha si viene del servidor para que el v-date-picker la entienda
      fecha_nacimiento: item.fecha_nacimiento ? new Date(item.fecha_nacimiento) : null
    };
  } else {
    editedItem.value = { ...defaultItem };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    if (form.value) form.value.resetValidation();
  });
};

const save = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    if (editedItem.value.id) {
      // Editar usuario
      const { id, created_at, updated_at, ...updateData } = editedItem.value;
      // Formatear la fecha a YYYY-MM-DD antes de enviar
      if (updateData.fecha_nacimiento instanceof Date) {
        updateData.fecha_nacimiento = updateData.fecha_nacimiento.toISOString().split('T')[0];
      }
      await userService.update(id, updateData);
    } else {
      // Crear usuario
      if (editedItem.value.fecha_nacimiento instanceof Date) {
        editedItem.value.fecha_nacimiento = editedItem.value.fecha_nacimiento.toISOString().split('T')[0];
      }
      await userService.create(editedItem.value);
    }
    fetchUsers(); // Recargar la lista
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
  } finally {
    closeDialog();
  }
};

onMounted(fetchUsers);
</script>