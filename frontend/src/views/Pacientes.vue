<template>
  <v-container>
    <v-card>
      <!-- Encabezado revertido al diseño original -->
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-account-group"></v-icon> &nbsp;
        Gestión de Pacientes

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          density="compact"
          label="Buscar paciente..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>

        <v-btn
          color="primary"
          class="ml-4"
          @click="openNewPatientDialog"
        >
          Nuevo Paciente
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="pacientes"
        :search="search"
        :loading="loading"
        :sort-by="[{ key: 'numero_historia', order: 'asc' }]"
        loading-text="Cargando pacientes..."
        no-data-text="No se encontraron pacientes."
        items-per-page-text="Pacientes por página"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            size="small"
            class="me-2"
            @click="editItem(item)"
            title="Editar Paciente"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            @click="deleteItem(item)"
            title="Eliminar Paciente"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog for creating/editing a patient -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="save">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.numero_historia"
                    label="Número de Historia"
                    :rules="[rules.numeroHistoria]"
                  ></v-text-field>
                </v-col>
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
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.documento_identidad"
                    label="Documento de Identidad"
                    :rules="[rules.required, rules.documentoIdentidad]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
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
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import pacienteService from '@/services/pacienteService';

// State
const search = ref('');
const loading = ref(true);
const dialog = ref(false);
const pacientes = ref([]);
const editedIndex = ref(-1);
const editedItem = ref({
  id: null,
  nombre: '',
  apellido: '',
  documento_identidad: '',
  numero_historia: '',
});
const defaultItem = { ...editedItem.value };

// Table headers
const form = ref(null); // Add ref for the form
const headers = [
  { title: 'Nro. de Historia', key: 'numero_historia', align: 'start' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Apellido', key: 'apellido' },
  { title: 'Documento', key: 'documento_identidad' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];

// Validation rules
const rules = {
  required: value => !!value || 'Este campo es requerido.',
  documentoIdentidad: value => {
    const regex = /^(V-|E-|J-|G-)?\d{7,9}$/i;
    return regex.test(value) || 'Formato de documento inválido (ej. V-12345678, 12345678).';
  },
  numeroHistoria: value => {
    if (!value) return true; // Optional field
    const regex = /^(H-)?\d+$/i;
    return regex.test(value) || 'Formato de número de historia inválido (ej. H-123, 123).';
  },
};

// Computed property for dialog title
const formTitle = computed(() => (editedIndex.value === -1 ? 'Nuevo Paciente' : 'Editar Paciente'));

// Methods
async function loadPacientes() {
  loading.value = true;
  try {
    pacientes.value = await pacienteService.getAll();
  } catch (error) {
    console.error('Error al cargar los pacientes:', error);
  } finally {
    loading.value = false;
  }
}

function openNewPatientDialog() {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  dialog.value = true;
}

function editItem(item) {
  editedIndex.value = pacientes.value.findIndex(p => p.id === item.id);
  editedItem.value = { ...item };
  dialog.value = true;
}

async function deleteItem(item) {
  if (confirm('¿Estás seguro de que deseas eliminar a este paciente?')) {
    try {
      await pacienteService.delete(item.id);
      pacientes.value = pacientes.value.filter(p => p.id !== item.id);
    } catch (error) {
      console.error('Error al eliminar el paciente:', error);
      alert('No se pudo eliminar el paciente.');
    }
  }
}

function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
}

async function save() {
  const { valid } = await form.value.validate();
  if (!valid) {
    return; // Validation failed, do not proceed
  }

  try {
    if (editedIndex.value > -1) {
      const updatedPatient = await pacienteService.update(editedItem.value.id, editedItem.value);
      Object.assign(pacientes.value[editedIndex.value], updatedPatient);
    } else {
      const newPatient = await pacienteService.create(editedItem.value);
      pacientes.value.push(newPatient);
    }
    close();
  } catch (error) {
    console.error('Error al guardar el paciente:', error);
    alert('Ocurrió un error al guardar el paciente.');
  }
}

onMounted(loadPacientes);
</script>