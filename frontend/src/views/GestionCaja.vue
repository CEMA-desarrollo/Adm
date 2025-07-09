<template>
  <v-container>
    <!-- Notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000" location="top end">
      {{ snackbar.text }}
    </v-snackbar>

    <v-card class="mx-auto" max-width="600">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-cash-register" class="me-2"></v-icon>
        <span class="text-h5">Gestión de Caja</span>
      </v-card-title>
      <v-card-subtitle>Control de aperturas y cierres de caja</v-card-subtitle>

      <v-divider class="my-4"></v-divider>

      <v-card-text>
        <v-alert v-if="loading" type="info" variant="tonal" border="start" prominent>
          <template v-slot:prepend><v-progress-circular indeterminate size="24"></v-progress-circular></template>
          Consultando estado de la caja...
        </v-alert>

        <div v-else>
          <!-- Estado: Caja Abierta -->
          <v-alert v-if="cajaAbierta" type="success" variant="outlined" icon="mdi-lock-open-variant-outline">
            <h3 class="mb-2">Caja Abierta</h3>
            <p>La caja fue abierta por <strong>{{ sesionActual.nombre_usuario }}</strong>.</p>
            <p>Fecha de apertura: <strong>{{ formatDate(sesionActual.fecha_apertura) }}</strong></p>
            <p>Monto de apertura: <strong>${{ parseFloat(sesionActual.monto_apertura_usd).toFixed(2) }}</strong></p>
          </v-alert>

          <!-- Estado: Caja Cerrada -->
          <v-alert v-else type="warning" variant="outlined" icon="mdi-lock-outline">
            <h3 class="mb-2">Caja Cerrada</h3>
            <p>No hay ninguna sesión de caja activa en este momento. Para registrar transacciones, es necesario abrir la caja.</p>
          </v-alert>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!cajaAbierta"
          color="primary"
          variant="flat"
          @click="dialogAbrir = true"
          :loading="actionLoading"
          prepend-icon="mdi-cash-plus"
        >
          Abrir Caja
        </v-btn>
        <v-btn
          v-if="cajaAbierta && esAdmin"
          color="error"
          variant="flat"
          @click="dialogCerrar = true"
          :loading="actionLoading"
          prepend-icon="mdi-cash-lock"
        >
          Cerrar Caja
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialogo para Abrir Caja -->
    <v-dialog v-model="dialogAbrir" max-width="500px" persistent>
      <v-card>
        <v-card-title>Abrir Sesión de Caja</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="montoApertura"
            label="Monto de Apertura (USD)"
            type="number"
            prefix="$"
            variant="outlined"
            autofocus
            :rules="[v => !!v || 'El monto es requerido', v => v >= 0 || 'El monto no puede ser negativo']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogAbrir = false">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAbrirCaja" :loading="actionLoading">Confirmar Apertura</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo para Cerrar Caja -->
    <v-dialog v-model="dialogCerrar" max-width="500px" persistent>
      <v-card>
        <v-card-title>Cerrar Sesión de Caja</v-card-title>
        <v-card-text>
          <p class="mb-4">Estás a punto de cerrar la caja. Por favor, cuenta el dinero y registra el monto real.</p>
          <v-text-field
            v-model.number="montoCierreReal"
            label="Monto Real en Caja (USD)"
            type="number"
            prefix="$"
            variant="outlined"
            autofocus
            :rules="[v => v !== null && v !== '' || 'El monto es requerido', v => v >= 0 || 'El monto no puede ser negativo']"
          ></v-text-field>
          <v-textarea
            v-model="notasCierre"
            label="Notas Adicionales (Opcional)"
            variant="outlined"
            rows="3"
            placeholder="Ej: Diferencia por pago redondeado, etc."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogCerrar = false">Cancelar</v-btn>
          <v-btn color="error" @click="handleCerrarCaja" :loading="actionLoading">Confirmar Cierre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import cajaService from '@/services/cajaService';
// Asumimos que tienes un store (Pinia/Vuex) para el estado del usuario.
// import { useAuthStore } from '@/stores/auth';

// const authStore = useAuthStore();
// const esAdmin = computed(() => authStore.user?.rol === 'Administrador');
// Placeholder si no usas un store:
const esAdmin = ref(true); // Cambiar por la lógica real de roles

const loading = ref(true);
const actionLoading = ref(false);
const cajaAbierta = ref(false);
const sesionActual = ref(null);
const snackbar = ref({ show: false, text: '', color: 'success' });

const dialogAbrir = ref(false);
const montoApertura = ref(0);

const dialogCerrar = ref(false);
const montoCierreReal = ref(null);
const notasCierre = ref('');

const fetchEstadoCaja = async () => {
  loading.value = true;
  try {
    const { data } = await cajaService.getEstado();
    cajaAbierta.value = data.estado === 'ABIERTA';
    sesionActual.value = data.sesion;
  } catch (error) {
    showSnackbar('Error al consultar el estado de la caja.', 'error');
  } finally {
    loading.value = false;
  }
};

const handleAbrirCaja = async () => {
  if (montoApertura.value === null || montoApertura.value < 0) {
    showSnackbar('Por favor, introduce un monto de apertura válido.', 'warning');
    return;
  }
  actionLoading.value = true;
  try {
    await cajaService.abrirCaja(montoApertura.value);
    showSnackbar('Caja abierta exitosamente.', 'success');
    dialogAbrir.value = false;
    montoApertura.value = 0;
    await fetchEstadoCaja(); // Refrescar estado
  } catch (error) {
    showSnackbar(error.response?.data?.message || 'Error al abrir la caja.', 'error');
  } finally {
    actionLoading.value = false;
  }
};

const handleCerrarCaja = async () => {
  if (montoCierreReal.value === null || montoCierreReal.value < 0) {
    showSnackbar('Por favor, introduce el monto real en caja.', 'warning');
    return;
  }
  actionLoading.value = true;
  try {
    const datos