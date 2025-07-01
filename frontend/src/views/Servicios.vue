<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Gestión de Servicios</span>
            <v-btn color="primary" @click="openNewItemDialog">
              <v-icon left>mdi-plus</v-icon>
              Nuevo Servicio
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de Servicios Activos -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Servicios Activos</v-card-title>
          <v-data-table
            :headers="headers"
            :items="serviciosActivos"
            :loading="loading"
            class="elevation-1"
            no-data-text="No hay servicios activos."
            loading-text="Cargando servicios..."
          >
            <template v-slot:item.precio_sugerido_usd="{ item }">
              <span>${{ parseFloat(item.precio_sugerido_usd).toFixed(2) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="openEditItemDialog(item)" title="Editar">mdi-pencil</v-icon>
              <!-- CAMBIO: Icono y acción para desactivar, no eliminar -->
              <v-icon small @click="deactivateItem(item)" title="Desactivar">mdi-eye-off-outline</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <!-- Tabla de Servicios Inactivos -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Servicios Inactivos</v-card-title>
          <v-data-table
            :headers="headersInactivos"
            :items="serviciosInactivos"
            :loading="loading"
            class="elevation-1"
            no-data-text="No hay servicios inactivos."
            loading-text="Cargando servicios..."
          >
            <template v-slot:item.precio_sugerido_usd="{ item }">
              <span>${{ parseFloat(item.precio_sugerido_usd).toFixed(2) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
              <!-- CAMBIO: Añadido botón para editar -->
              <v-icon small class="mr-2" @click="openEditItemDialog(item)" title="Editar">mdi-pencil</v-icon>
              <v-icon small class="mr-2" @click="activateItem(item)" title="Reactivar">mdi-check-circle-outline</v-icon>
              <!-- CAMBIO: Añadido botón para eliminar permanentemente -->
              <v-icon small color="error" @click="deleteItemPermanently(item)" title="Eliminar Permanentemente">mdi-delete-forever</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para Crear/Editar Servicio -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.nombre_servicio" label="Nombre del Servicio" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.precio_sugerido_usd" label="Precio Sugerido (USD)" type="number" prefix="$" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.especialidad_id"
                  :items="especialidades"
                  item-title="nombre"
                  item-value="id"
                  label="Especialidad (Opcional)"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.descripcion" label="Descripción (Opcional)" rows="2"></v-textarea>
              </v-col>
              <v-col cols="12" v-if="editedItem.id">
                <v-switch
                  v-model="editedItem.activo"
                  :label="editedItem.activo ? 'Estado: Activo' : 'Estado: Inactivo'"
                  color="primary"
                  inset
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveItem">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import servicioService from '@/services/servicioService';
import especialidadService from '@/services/especialidadService';

// --- Estado del Componente ---
const allServices = ref([]);
const especialidades = ref([]);
const loading = ref(true);
const dialog = ref(false);
const editedItem = ref({
  id: null,
  nombre_servicio: '',
  precio_sugerido_usd: 0,
  especialidad_id: null,
  descripcion: '',
  activo: true,
});
const defaultItem = { ...editedItem.value };

// --- Headers para las tablas ---
const headers = [
  { title: 'Nombre del Servicio', key: 'nombre_servicio', sortable: true },
  { title: 'Especialidad', key: 'especialidad_nombre', sortable: true },
  { title: 'Precio (USD)', key: 'precio_sugerido_usd', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];
// Headers para inactivos (puede ser el mismo o diferente si se quiere)
const headersInactivos = [...headers];


// --- Propiedades Computadas ---
const formTitle = computed(() => (editedItem.value.id ? 'Editar Servicio' : 'Nuevo Servicio'));
const serviciosActivos = computed(() => allServices.value.filter(s => s.activo));
const serviciosInactivos = computed(() => allServices.value.filter(s => !s.activo));

// --- Lógica de Carga de Datos ---
async function fetchData() {
  loading.value = true;
  try {
    const [servicesData, especialidadesData] = await Promise.all([
      servicioService.getAll(),
      especialidadService.getAll(true)
    ]);
    allServices.value = servicesData;
    especialidades.value = especialidadesData;
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);

// --- Gestión del Diálogo ---
function openNewItemDialog() {
  editedItem.value = { ...defaultItem };
  dialog.value = true;
}

function openEditItemDialog(item) {
  editedItem.value = { ...item, activo: Boolean(item.activo) };
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
}

// --- Acciones CRUD ---
async function saveItem() {
  try {
    if (editedItem.value.id) {
      await servicioService.update(editedItem.value.id, editedItem.value);
    } else {
      await servicioService.create(editedItem.value);
    }
    await fetchData();
  } catch (error) {
    console.error("Error al guardar el servicio:", error);
  } finally {
    closeDialog();
  }
}

async function deactivateItem(item) {
  if (confirm(`¿Estás seguro de que quieres DESACTIVAR "${item.nombre_servicio}"?`)) {
    try {
      // La función de desactivación es un update que cambia el estado 'activo' a false
      await servicioService.update(item.id, { ...item, activo: false });
      await fetchData();
    } catch (error) {
      console.error("Error al desactivar el servicio:", error);
    }
  }
}

async function activateItem(item) {
  if (confirm(`¿Estás seguro de que quieres REACTIVAR "${item.nombre_servicio}"?`)) {
    try {
      await servicioService.update(item.id, { ...item, activo: true });
      await fetchData();
    } catch (error) {
      console.error("Error al activar el servicio:", error);
    }
  }
}

// NUEVA FUNCIÓN: Eliminación permanente
async function deleteItemPermanently(item) {
  const confirmation = prompt(`¡ACCIÓN IRREVERSIBLE!\nPara eliminar permanentemente el servicio "${item.nombre_servicio}", escribe "eliminar" en el campo de abajo.`);
  if (confirmation === 'eliminar') {
    try {
      await servicioService.deletePermanent(item.id);
      await fetchData();
    } catch (error) {
      console.error("Error en la eliminación permanente:", error);
      alert(error.response?.data?.message || 'No se pudo eliminar el servicio.');
    }
  } else if (confirmation !== null) {
    alert('Confirmación incorrecta. La eliminación ha sido cancelada.');
  }
}
</script>
