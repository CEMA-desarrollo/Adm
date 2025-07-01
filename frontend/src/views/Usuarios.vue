<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Gestión de Usuarios</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog()">Crear Usuario</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.activo="{ item }">
          <v-chip :color="item.activo ? 'green' : 'red'" dark>{{ item.activo ? 'Activo' : 'Inactivo' }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openDialog(item)">mdi-pencil</v-icon>
          <!-- <v-icon small @click="deleteUser(item)">mdi-delete</v-icon> -->
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogo para Crear/Editar Usuario -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.nombre_usuario"
                  label="Nombre de Usuario"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="!editedItem.id">
                <v-text-field
                  v-model="editedItem.password"
                  label="Contraseña"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.rol"
                  :items="['admin', 'recepcionista']"
                  label="Rol"
                  required
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
import { ref, onMounted, computed } from 'vue';
import userService from '@/services/userService';

const users = ref([]);
const loading = ref(true);
const dialog = ref(false);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre de Usuario', key: 'nombre_usuario' },
  { title: 'Rol', key: 'rol' },
  { title: 'Estado', key: 'activo' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const editedItem = ref({
  id: null,
  nombre_usuario: '',
  password: '',
  rol: 'recepcionista',
  activo: true,
});

const defaultItem = {
  id: null,
  nombre_usuario: '',
  password: '',
  rol: 'recepcionista',
  activo: true,
};

const formTitle = computed(() => (editedItem.value.id ? 'Editar Usuario' : 'Nuevo Usuario'));

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
    editedItem.value = { ...item, activo: !!item.activo }; // Asegurarse de que activo sea booleano
  } else {
    editedItem.value = { ...defaultItem };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const save = async () => {
  try {
    if (editedItem.value.id) {
      // Editar usuario
      const { id, ...updateData } = editedItem.value;
      await userService.update(id, updateData);
    } else {
      // Crear usuario
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