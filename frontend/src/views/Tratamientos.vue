<template>
  <v-container fluid>
    <!-- Notificaciones Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom end">
      {{ snackbar.text }}
    </v-snackbar>

    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-medical-bag"></v-icon> &nbsp;
        Gestión de Tratamientos

        <v-spacer></v-spacer>

        <v-btn class="ms-4" color="primary" @click="openNewTratamientoDialog">
          <v-icon icon="mdi-plus"></v-icon>
          Añadir Tratamiento
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              density="compact"
              label="Buscar paciente, proveedor o servicio..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="filterStartDate" type="date" label="Desde" variant="outlined" density="compact" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="filterEndDate" type="date" label="Hasta" variant="outlined" density="compact" hide-details></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="filteredTratamientos"
        :search="search"
        :loading="loading"
        loading-text="Cargando datos..."
        no-data-text="No se encontraron tratamientos."
        items-per-page-text="Tratamientos por página"
      >
        <!-- Aquí irán las columnas personalizadas para estado, acciones, etc. -->
        <template v-slot:item.fecha_tratamiento="{ value }">
          <!-- Formateamos la fecha para que sea legible -->
          {{ new Date(value).toLocaleDateString('es-VE', { timeZone: 'UTC' }) }}
        </template>

        <template v-slot:item.estado="{ value }">
          <v-chip :color="getEstadoColor(value)" dark small>
            {{ value }}
          </v-chip>
        </template>

        <template v-slot:item.costo_final_acordado_usd="{ value }">
          <!-- Formateamos el costo para que se muestre como moneda -->
          ${{ parseFloat(value).toFixed(2) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editTratamiento(item)" title="Editar">mdi-pencil</v-icon>
          <v-icon size="small" @click="cancelTratamiento(item)" title="Cancelar Tratamiento">mdi-close-circle-outline</v-icon>
        </template>

      </v-data-table>
    </v-card>

    <!-- Aquí irá el diálogo para crear/editar tratamientos -->
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- Fila 1: Paciente y Proveedor -->
              <v-col cols="12" sm="6">
                <v-autocomplete 
                  v-model="editedItem.paciente_id"
                  label="Seleccionar Paciente" 
                  :items="pacientesList" 
                  item-title="nombre_completo_ci" 
                  item-value="id" 
                  variant="outlined"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete v-model="editedItem.proveedor_id" label="Seleccionar Proveedor" :items="proveedoresList" item-title="nombre_completo" item-value="id" variant="outlined" clearable></v-autocomplete>
              </v-col>

              <!-- Fila 2: Servicio y Fecha -->
              <v-col cols="12" sm="6">
                <v-autocomplete 
                  v-model="editedItem.servicio_id" 
                  label="Seleccionar Servicio" 
                  :items="serviciosFiltrados" 
                  item-title="nombre_servicio" 
                  item-value="id" 
                  variant="outlined" 
                  clearable
                  :disabled="!editedItem.proveedor_id || isLoadingServicios"
                  :loading="isLoadingServicios"
                  no-data-text="Seleccione un proveedor o este no tiene servicios asignados"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.fecha_tratamiento" type="date" label="Fecha del Tratamiento" variant="outlined"></v-text-field>
              </v-col>

              <!-- Fila 3: Costos y Estado -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.costo_final_acordado_usd" label="Costo Acordado (USD)" type="number" prefix="$" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-select v-model="editedItem.estado" label="Estado" :items="['Programado', 'Realizado', 'Cancelado']" variant="outlined"></v-select>
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
import { ref, onMounted, computed, watch } from 'vue';
import tratamientoService from '@/services/tratamientoService';
import pacienteService from '@/services/pacienteService';
import proveedorService from '@/services/proveedorService';
import servicioService from '@/services/servicioService';

const search = ref('');
const loading = ref(true);
const dialog = ref(false);
const tratamientos = ref([]);

const snackbar = ref({ show: false, text: '', color: 'success' });
// Listas para los autocompletes del formulario
const pacientesList = ref([]);
const proveedoresList = ref([]);
const serviciosList = ref([]);
const serviciosAsignados = ref([]);
const isLoadingServicios = ref(false);

const getWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day; // Adjust for Sunday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  
  const format = (date) => date.toISOString().split('T')[0];
  
  return { start: format(monday), end: format(saturday) };
};

const { start: weekStart, end: weekEnd } = getWeekRange();
const filterStartDate = ref(weekStart);
const filterEndDate = ref(weekEnd);

const defaultItem = {
  id: null,
  paciente_id: null,
  proveedor_id: null,
  servicio_id: null,
  fecha_tratamiento: new Date().toISOString().substr(0, 10),
  costo_original_usd: null,
  costo_final_acordado_usd: null,
  estado: 'Programado',
  descripcion_adicional: '',
  justificacion_descuento: '',
};

const editedItem = ref({ ...defaultItem });

const headers = ref([
  { title: 'Fecha', key: 'fecha_tratamiento', align: 'start' },
  { title: 'Paciente', key: 'paciente_nombre' },
  { title: 'Proveedor', key: 'proveedor_nombre' },
  { title: 'Servicio', key: 'servicio_nombre' },
  { title: 'Costo', key: 'costo_final_acordado_usd', align: 'end' },
  { title: 'Estado', key: 'estado', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]);

const formTitle = computed(() => (editedItem.value.id ? 'Editar Tratamiento' : 'Nuevo Tratamiento'));

const filteredTratamientos = computed(() => {
  return tratamientos.value.filter(t => {
    // Si no hay fechas de filtro, no se aplica filtro de fecha.
    if (!filterStartDate.value && !filterEndDate.value) return true;
    
    const treatmentDate = t.fecha_tratamiento.split('T')[0];
    const isAfterStart = filterStartDate.value ? treatmentDate >= filterStartDate.value : true;
    const isBeforeEnd = filterEndDate.value ? treatmentDate <= filterEndDate.value : true;
    
    return isAfterStart && isBeforeEnd;
  });
});

const serviciosFiltrados = computed(() => {
  if (!editedItem.value.proveedor_id || serviciosAsignados.value.length === 0) {
    return [];
  }
  
  // Creamos un conjunto de IDs de los servicios asignados para una búsqueda rápida.
  const assignedIds = new Set(serviciosAsignados.value.map(s => s.servicio_id));

  // Filtramos la lista principal de servicios del sistema para mostrar solo los asignados.
  return serviciosList.value.filter(s => assignedIds.has(s.id));
});

async function loadInitialData() {
  loading.value = true;
  try {
    // Renombramos la variable para mayor claridad, ya que la API devuelve un objeto paginado.
    const [tratamientosResponse, pacientesData, proveedoresData, serviciosData] = await Promise.all([
      tratamientoService.getAll(),
      pacienteService.getAll(),
      proveedorService.getAll(true), // Solo proveedores activos
      servicioService.getAll(true)  // Solo servicios activos
    ]);

    // El error ocurre porque la API de tratamientos devuelve un objeto { tratamientos: [...], total: ... }
    // y el código intentaba hacer .map() sobre el objeto completo en lugar del array interno.
    // La solución es acceder a la propiedad 'tratamientos' de la respuesta.
    const tratamientosData = tratamientosResponse.tratamientos;
    if (!Array.isArray(tratamientosData)) {
      throw new TypeError("La respuesta de la API de tratamientos no contiene un array válido.");
    }

    // Enriquecemos los datos de tratamientos en el frontend.
    // Esto nos protege si la API no devuelve los nombres y asegura que la tabla siempre se vea bien.
    tratamientos.value = tratamientosData.map(t => {
      const paciente = pacientesData.find(p => p.id === t.paciente_id);
      const proveedor = proveedoresData.find(p => p.id === t.proveedor_id);
      const servicio = serviciosData.find(s => s.id === t.servicio_id);
      return {
        ...t,
        paciente_nombre: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido',
        proveedor_nombre: proveedor ? proveedor.nombre_completo : 'Desconocido',
        servicio_nombre: servicio ? servicio.nombre_servicio : 'Desconocido',
      };
    });
    pacientesList.value = pacientesData.map(p => ({
      ...p,
      nombre_completo_ci: `${p.nombre} ${p.apellido} (${p.documento_identidad})`
    }));
    proveedoresList.value = proveedoresData;
    serviciosList.value = serviciosData;

  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);
    showSnackbar('Error al cargar los datos iniciales.', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(loadInitialData);

watch(() => editedItem.value.proveedor_id, async (newProviderId, oldProviderId) => {
  if (newProviderId === oldProviderId) return;

  // Solo reseteamos el servicio si el usuario cambia activamente el proveedor en el formulario.
  // Si oldProviderId es nulo, significa que estamos inicializando el formulario para una edición.
  if (oldProviderId) {
    editedItem.value.servicio_id = null;
  }
  serviciosAsignados.value = [];

  if (newProviderId) {
    isLoadingServicios.value = true;
    try {
      // Usamos el servicio que ya existe para obtener los servicios asignados a este proveedor
      const assigned = await proveedorService.getServicesByProveedor(newProviderId);
      serviciosAsignados.value = assigned;
    } catch (error) {
      console.error(`Error al cargar servicios para el proveedor ${newProviderId}:`, error);
    } finally {
      isLoadingServicios.value = false;
    }
  }
});

watch(() => editedItem.value.servicio_id, (newServiceId) => {
  // Si se selecciona un servicio, autocompletamos el costo.
  if (newServiceId) {
    const servicioSeleccionado = serviciosFiltrados.value.find(s => s.id === newServiceId);
    if (servicioSeleccionado) {
      editedItem.value.costo_original_usd = servicioSeleccionado.precio_sugerido_usd;
      editedItem.value.costo_final_acordado_usd = servicioSeleccionado.precio_sugerido_usd;
    }
  } else {
    editedItem.value.costo_final_acordado_usd = null;
  }
});

// Función para abrir el diálogo de nuevo tratamiento (aún por implementar)
function openNewTratamientoDialog() {
  console.log('Abriendo diálogo para nuevo tratamiento...');
  editedItem.value = { ...defaultItem };
  dialog.value = true; // ¡Esta línea abre el diálogo!
}

async function editTratamiento(item) {
  // Usamos una copia profunda para no modificar el original hasta guardar
  editedItem.value = JSON.parse(JSON.stringify(item));
  
  // Asegurarnos de que la fecha está en el formato YYYY-MM-DD
  if (editedItem.value.fecha_tratamiento) {
    editedItem.value.fecha_tratamiento = editedItem.value.fecha_tratamiento.substr(0, 10);
  }

  // Al asignar un nuevo valor a `editedItem`, el watcher de `proveedor_id` se
  // disparará automáticamente y cargará los servicios correspondientes.
  // Por lo tanto, no es necesario cargar los servicios aquí.
  dialog.value = true;
}

async function cancelTratamiento(item) {
  if (confirm(`¿Estás seguro de que quieres CANCELAR el tratamiento para "${item.paciente_nombre}"?`)) {
    try {
      await tratamientoService.update(item.id, { estado: 'Cancelado' });
      showSnackbar('Tratamiento cancelado con éxito.');
      // Recargar los datos para reflejar el cambio de estado.
      await loadInitialData();
    } catch (error) {
      console.error("Error al cancelar el tratamiento:", error);
      showSnackbar('No se pudo cancelar el tratamiento.', 'error');
    }
  }
}

function closeDialog() {
  dialog.value = false;
}

async function saveItem() {
  // --- Validación de campos obligatorios ---
  const item = editedItem.value;
  if (!item.paciente_id || !item.proveedor_id || !item.servicio_id || !item.fecha_tratamiento || !item.costo_final_acordado_usd) {
    showSnackbar('Por favor, complete todos los campos: Paciente, Proveedor, Servicio, Fecha y Costo.', 'warning');
    return;
  }
  // --- Fin de la validación ---

  try {
    if (item.id) {
      // Actualizando un tratamiento existente
      await tratamientoService.update(item.id, item);
      showSnackbar('Tratamiento actualizado con éxito.');
    } else {
      // Creando un nuevo tratamiento
      await tratamientoService.create(item);
      showSnackbar('Tratamiento creado con éxito.');
    }
    // La solución más robusta: recargar todos los datos desde el servidor.
    // Esto asegura que la tabla siempre muestre la información más reciente y completa.
    await loadInitialData();
  } catch (error) {
    console.error("Error al guardar el tratamiento:", error);
    showSnackbar(`Error al guardar: ${error.response?.data?.message || error.message}`, 'error');
  } finally {
    closeDialog();
  }
}

function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}

function getEstadoColor(estado) {
  switch (estado) {
    case 'Realizado': return 'teal';
    case 'Cancelado': return 'orange-darken-2';
    case 'Programado': return 'blue';
    default: return 'grey';
  }
}
</script>