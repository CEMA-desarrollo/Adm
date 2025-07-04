<template>
  <v-container fluid>
    <!-- Notificaciones Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2000"
      location="bottom end"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
      </template>
    </v-snackbar>

    <!-- Tarjeta Principal -->
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-tag-multiple"></v-icon> &nbsp;
        Gestión de Especialidades

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          density="compact"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>

        <!-- Diálogo para Crear/Editar Especialidad -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="ms-4" color="primary">
              Nueva Especialidad
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre de la Especialidad"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.descripcion"
                      label="Descripción (Opcional)"
                      rows="2"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" v-if="editedIndex > -1">
                     <v-switch
                        v-model="editedItem.activo"
                        :label="editedItem.activo ? 'Activa' : 'Inactiva'"
                        color="primary"
                      ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Diálogo para Desactivar Especialidad -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Eliminar Especialidad?</v-card-title>
            <v-card-text>¿Estás seguro de que deseas **eliminar permanentemente** esta especialidad? Esta acción no se puede deshacer. La eliminación fallará si la especialidad está en uso.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="red-darken-1" variant="text" @click="deleteItemConfirm">Eliminar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card-title>

      <v-divider></v-divider>

      <!-- Tabla de Datos de Especialidades -->
      <v-data-table
        :headers="headers"
        :items="especialidades"
        :search="search"
        :loading="loading"
        loading-text="Cargando datos..."
        no-data-text="No se encontraron especialidades"
        items-per-page-text="Especialidades por página"
      >
        <template v-slot:item.activo="{ value }">
          <v-chip :color="value ? 'green' : 'red'">
            {{ value ? 'Activa' : 'Inactiva' }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import especialidadService from '@/services/especialidadService';

const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(true);
const especialidades = ref([]);

const snackbar = ref({
  show: false,
  color: 'success',
  text: '',
});

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Estado', key: 'activo' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const editedIndex = ref(-1);
const editedItem = ref({
  id: null,
  nombre: '',
  descripcion: '',
  activo: true,
});
const defaultItem = {
  id: null,
  nombre: '',
  descripcion: '',
  activo: true,
};

const rules = {
  required: value => !!value || 'Este campo es obligatorio.',
};

const formTitle = computed(() => (editedIndex.value === -1 ? 'Nueva Especialidad' : 'Editar Especialidad'));

watch(dialog, (val) => val || close());
watch(dialogDelete, (val) => val || closeDelete());

onMounted(() => {
  loadEspecialidades();
});

async function loadEspecialidades() {
  loading.value = true;
  try {
    especialidades.value = await especialidadService.getAll();
  } catch (error) {
    console.error("Error al cargar especialidades:", error);
    showSnackbar('No se pudieron cargar las especialidades.', 'error');
  } finally {
    loading.value = false;
  }
}

function editItem(item) {
  editedIndex.value = especialidades.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
}

function deleteItem(item) {
  editedIndex.value = especialidades.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
}

async function deleteItemConfirm() {
  try {
    // Se asume que el servicio ahora intenta un borrado permanente en el backend.
    await especialidadService.delete(editedItem.value.id);
    showSnackbar('La especialidad ha sido eliminada correctamente.', 'success');
    // Recargamos los datos para reflejar la eliminación en la tabla.
    await loadEspecialidades();
  } catch (error) {
    console.error("Error al desactivar especialidad:", error);
    // Mensaje de error personalizado si la API indica que el recurso está en uso.
    const message = error.response?.status === 409 ? 'No se puede eliminar: la especialidad está en uso.' : `No se pudo eliminar la especialidad. ${error.response?.data?.message || ''}`;
    showSnackbar(message, 'error');
  }
  closeDelete();
}
  
function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
}

function closeDelete() {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
}
  
async function save() {
  if (!editedItem.value.nombre) {
    showSnackbar('Por favor, complete el campo de nombre.', 'warning');
    return;
  }
  
  try {
    if (editedIndex.value > -1) {
      await especialidadService.update(editedItem.value.id, editedItem.value);
      showSnackbar('Especialidad actualizada con éxito.');
    } else {
      await especialidadService.create(editedItem.value);
      showSnackbar('Especialidad creada con éxito.');
    }
    // Después de guardar (crear o actualizar), recargamos la lista para mantener la consistencia.
    await loadEspecialidades();
  } catch (error) {
    console.error("Error al guardar la especialidad:", error);
    showSnackbar(`No se pudo guardar la especialidad. ${error.response?.data?.message || ''}`, 'error');
  }
  close();
}

function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}
</script>