<template>
  <v-container fluid>
    <!-- Notificaciones Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom end">
      {{ snackbar.text }}
    </v-snackbar>

    <v-row>
      <!-- Columna para registrar nueva tasa -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon icon="mdi-plus-circle-outline"></v-icon> &nbsp;
            Registrar Tasa del Día
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="guardarTasa">
              <v-text-field
                v-model="nuevaTasa.fecha"
                type="date"
                label="Fecha"
                variant="outlined"
                readonly
              ></v-text-field>
              <v-text-field
                v-model="nuevaTasa.tasa_bs_por_usd"
                label="Tasa (Bs. por USD)"
                type="number"
                step="0.01"
                prefix="Bs."
                variant="outlined"
                class="mt-4"
                :rules="[v => !!v || 'La tasa es requerida']"
              ></v-text-field>
              <v-btn type="submit" color="primary" block class="mt-4" :loading="guardando">
                Guardar Tasa
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna para mostrar historial de tasas -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon icon="mdi-history"></v-icon> &nbsp;
            Historial de Tasas de Cambio
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="historialTasas"
            :loading="loading"
            loading-text="Cargando historial..."
            no-data-text="No hay tasas registradas."
            items-per-page-text="Tasas por página"
          >
            <template v-slot:item.fecha="{ value }">
              {{ new Date(value).toLocaleDateString('es-VE', { timeZone: 'UTC' }) }}
            </template>
            <template v-slot:item.tasa_bs_por_usd="{ value }">
              Bs. {{ parseFloat(value).toFixed(2) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Asumimos que tienes un wrapper de axios, si no, lo creamos.

const snackbar = ref({ show: false, text: '', color: 'success' });
const loading = ref(true);
const guardando = ref(false);

const historialTasas = ref([]);
const nuevaTasa = ref({
  fecha: new Date().toISOString().substr(0, 10),
  tasa_bs_por_usd: null,
});

const headers = ref([
  { title: 'Fecha', key: 'fecha', align: 'start' },
  { title: 'Tasa (Bs. por USD)', key: 'tasa_bs_por_usd', align: 'end' },
]);

async function cargarHistorial() {
  loading.value = true;
  try {
    // NOTA: Necesitarás crear este endpoint en tu backend.
    const response = await axios.get('/api/tasas-cambio');
    historialTasas.value = response.data;
  } catch (error) {
    console.error("Error al cargar el historial de tasas:", error);
    showSnackbar('No se pudo cargar el historial.', 'error');
  } finally {
    loading.value = false;
  }
}

async function guardarTasa() {
  if (!nuevaTasa.value.tasa_bs_por_usd) {
    showSnackbar('Por favor, ingrese un valor para la tasa.', 'warning');
    return;
  }
  guardando.value = true;
  try {
    // NOTA: Necesitarás crear este endpoint en tu backend.
    await axios.post('/api/tasas-cambio', nuevaTasa.value);
    showSnackbar('Tasa guardada con éxito.');
    nuevaTasa.value.tasa_bs_por_usd = null; // Limpiar para el siguiente registro
    await cargarHistorial(); // Recargar la lista
  } catch (error) {
    console.error("Error al guardar la tasa:", error);
    const mensaje = error.response?.data?.message || 'No se pudo guardar la tasa.';
    showSnackbar(mensaje, 'error');
  } finally {
    guardando.value = false;
  }
}

function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}

onMounted(() => {
  cargarHistorial();
});
</script>