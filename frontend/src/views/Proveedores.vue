<template>
  <v-container fluid>
    <!-- Notificaciones Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom end">
      {{ snackbar.text }}
    </v-snackbar>

    <!-- Tarjeta de Título y Botón de Nuevo Proveedor -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-truck-delivery"></v-icon> &nbsp;
        Gestión de Proveedores
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openNewItemDialog">
          <v-icon left>mdi-plus</v-icon>
          Nuevo Proveedor
        </v-btn>
      </v-card-title>
    </v-card>

    <!-- Tabla de Proveedores Activos -->
    <v-card>
      <v-card-title>Proveedores Activos</v-card-title>
      <v-data-table
        :headers="headers"
        :items="proveedoresActivos"
        :loading="loading"
        :search="search"
        class="elevation-1"
        no-data-text="No hay proveedores activos."
        loading-text="Cargando datos..."
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              density="compact"
              label="Buscar en proveedores activos"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              hide-details
              single-line
            ></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="manageServices(item)" title="Asignar Servicios">mdi-briefcase-check</v-icon>
          <v-icon small class="mr-2" @click="openEditItemDialog(item)" title="Editar">mdi-pencil</v-icon>
          <v-icon small @click="deactivateItem(item)" title="Desactivar">mdi-eye-off-outline</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-divider class="my-6"></v-divider>

    <!-- Tabla de Proveedores Inactivos -->
    <v-card>
      <v-card-title>Proveedores Inactivos</v-card-title>
      <v-data-table
        :headers="headers"
        :items="proveedoresInactivos"
        :loading="loading"
        class="elevation-1"
        no-data-text="No hay proveedores inactivos."
        loading-text="Cargando datos..."
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditItemDialog(item)" title="Editar">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="activateItem(item)" title="Reactivar">mdi-check-circle-outline</v-icon>
          <v-icon small color="error" @click="deleteItemPermanently(item)" title="Eliminar Permanentemente">mdi-delete-forever</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para Crear/Editar Proveedor -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.nombre_completo" label="Nombre Completo" :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.especialidad_id" :items="especialidades" item-title="nombre" item-value="id" label="Especialidad" clearable></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.tipo_proveedor" :items="tiposProveedor" label="Tipo de Proveedor" :rules="[rules.required]"></v-select>
              </v-col>
              <v-col cols="12" v-if="editedItem.id !== null">
                <v-switch v-model="editedItem.activo" :label="editedItem.activo ? 'Estado: Activo' : 'Estado: Inactivo'" color="primary" inset></v-switch>
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

    <!-- Diálogo para Asignar Servicios -->
    <v-dialog v-model="dialogServicios" max-width="700px" persistent>
      <v-card v-if="selectedProveedor">
        <v-card-title>
          <span class="text-h5">Asignar Servicios a {{ selectedProveedor.nombre_completo }}</span>
        </v-card-title>
        <v-card-text>
          <!-- Alerta informativa sobre el filtrado -->
          <v-alert
            v-if="selectedProveedor.especialidad_id"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            Mostrando servicios para la especialidad: <strong>{{ selectedProveedor.especialidad_nombre }}</strong> y servicios generales.
          </v-alert>

          <!-- Autocomplete ahora usa la lista filtrada -->
          <v-autocomplete
            v-model="assignedServiceIds"
            :items="serviciosDisponiblesParaProveedor"
            item-title="nombre_servicio_display"
            item-value="id"
            label="Servicios Ofrecidos"
            multiple
            chips
            closable-chips
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeServiciosDialog">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveProveedorServicios">Guardar Servicios</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import proveedorService from '@/services/proveedorService';
import servicioService from '@/services/servicioService';
import especialidadService from '@/services/especialidadService';

// --- Estado del Componente ---
const search = ref('');
const dialog = ref(false);
const dialogServicios = ref(false);
const loading = ref(true);

const allProveedores = ref([]);
const allServicios = ref([]);
const especialidades = ref([]);

const selectedProveedor = ref(null);
const assignedServiceIds = ref([]);

const editedItem = ref({
  id: null,
  nombre_completo: '',
  especialidad_id: null,
  tipo_proveedor: null,
  activo: true,
});
const defaultItem = { ...editedItem.value };

const snackbar = ref({ show: false, color: 'success', text: '' });

// --- Headers y Datos para Selects ---
const headers = [
  { title: 'Nombre Completo', key: 'nombre_completo' },
  { title: 'Especialidad', key: 'especialidad_nombre' },
  { title: 'Tipo', key: 'tipo_proveedor' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];
const tiposProveedor = ['Medico', 'Fisioterapeuta', 'Otro'];
const rules = { required: value => !!value || 'Este campo es obligatorio.' };

// --- Propiedades Computadas ---
const formTitle = computed(() => (editedItem.value.id ? 'Editar Proveedor' : 'Nuevo Proveedor'));
const proveedoresActivos = computed(() => allProveedores.value.filter(p => p.activo));
const proveedoresInactivos = computed(() => allProveedores.value.filter(p => !p.activo));

// NUEVA: Propiedad computada para filtrar los servicios disponibles
const serviciosDisponiblesParaProveedor = computed(() => {
  if (!selectedProveedor.value) return [];

  // Si el proveedor no tiene especialidad, muestra todos los servicios activos.
  if (!selectedProveedor.value.especialidad_id) {
    return allServicios.value;
  }

  // Filtra los servicios que coinciden con la especialidad del proveedor o que son generales (sin especialidad).
  return allServicios.value.filter(servicio => {
    return servicio.especialidad_id === selectedProveedor.value.especialidad_id || servicio.especialidad_id === null;
  });
});

// --- Lógica de Carga de Datos ---
async function fetchData() {
  loading.value = true;
  try {
    const [proveedoresData, serviciosData, especialidadesData] = await Promise.all([
      proveedorService.getAll(),
      servicioService.getAll(),
      especialidadService.getAll(true)
    ]);
    allProveedores.value = proveedoresData;
    allServicios.value = serviciosData
      .filter(s => s.activo)
      .map(s => ({ ...s, nombre_servicio_display: `${s.nombre_servicio} (${s.especialidad_nombre || 'General'})` }));
    especialidades.value = especialidadesData;
  } catch (error) {
    console.error("Error al cargar datos:", error);
    showSnackbar('Error al cargar los datos iniciales.', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);

// --- Gestión de Diálogos ---
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
  if (!editedItem.value.nombre_completo || !editedItem.value.tipo_proveedor) {
    showSnackbar('Por favor, complete todos los campos obligatorios.', 'warning');
    return;
  }
  try {
    if (editedItem.value.id) {
      await proveedorService.update(editedItem.value.id, editedItem.value);
      showSnackbar('Proveedor actualizado con éxito.');
    } else {
      await proveedorService.create(editedItem.value);
      showSnackbar('Proveedor creado con éxito.');
    }
    await fetchData();
  } catch (error) {
    console.error("Error al guardar el proveedor:", error);
    showSnackbar(`No se pudo guardar el proveedor. ${error.response?.data?.message || ''}`, 'error');
  } finally {
    closeDialog();
  }
}

async function deactivateItem(item) {
  if (confirm(`¿Estás seguro de que quieres DESACTIVAR a "${item.nombre_completo}"?`)) {
    try {
      await proveedorService.update(item.id, { ...item, activo: false });
      showSnackbar('Proveedor desactivado correctamente.');
      await fetchData();
    } catch (error) {
      console.error("Error al desactivar proveedor:", error);
      showSnackbar('No se pudo desactivar el proveedor.', 'error');
    }
  }
}

async function activateItem(item) {
  if (confirm(`¿Estás seguro de que quieres REACTIVAR a "${item.nombre_completo}"?`)) {
    try {
      await proveedorService.update(item.id, { ...item, activo: true });
      showSnackbar('Proveedor reactivado correctamente.');
      await fetchData();
    } catch (error) {
      console.error("Error al activar proveedor:", error);
      showSnackbar('No se pudo activar el proveedor.', 'error');
    }
  }
}

async function deleteItemPermanently(item) {
  const confirmation = prompt(`¡ACCIÓN IRREVERSIBLE!\nPara eliminar permanentemente al proveedor "${item.nombre_completo}", escribe "eliminar" en el campo de abajo.`);
  if (confirmation === 'eliminar') {
    try {
      await proveedorService.deletePermanent(item.id);
      showSnackbar('Proveedor eliminado permanentemente.');
      await fetchData();
    } catch (error) {
      console.error("Error en la eliminación permanente:", error);
      alert(error.response?.data?.message || 'No se pudo eliminar el proveedor.');
    }
  } else if (confirmation !== null) {
    alert('Confirmación incorrecta. La eliminación ha sido cancelada.');
  }
}

// --- Gestión de Servicios Asignados ---
async function manageServices(item) {
  selectedProveedor.value = item;
  try {
    const assignedServices = await proveedorService.getServicesByProveedor(item.id);
    assignedServiceIds.value = assignedServices.map(s => s.servicio_id);
    dialogServicios.value = true;
  } catch (error) {
    console.error(`Error al obtener servicios para el proveedor ${item.id}:`, error);
    showSnackbar('No se pudieron cargar los servicios asignados.', 'error');
  }
}

function closeServiciosDialog() {
  dialogServicios.value = false;
  selectedProveedor.value = null;
  assignedServiceIds.value = [];
}

async function saveProveedorServicios() {
  if (!selectedProveedor.value) return;
  try {
    await proveedorService.updateProveedorServices(selectedProveedor.value.id, assignedServiceIds.value);
    showSnackbar('Servicios del proveedor actualizados con éxito.');
  } catch (error) {
    console.error(`Error al actualizar servicios para el proveedor ${selectedProveedor.value.id}:`, error);
    showSnackbar('No se pudieron actualizar los servicios.', 'error');
  }
  closeServiciosDialog();
}

// --- Utilidades ---
function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}
</script>
