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
            <p>Abierta por: <strong>{{ sesionActual.nombre_usuario }}</strong> el <strong>{{ formatDate(sesionActual.fecha_apertura) }}</strong></p>
            <v-divider class="my-2"></v-divider>
            <p class="font-weight-bold">Montos de Apertura:</p>
            <v-list dense class="transparent-list">
              <v-list-item v-for="metodo in metodosDePago" :key="`apertura-${metodo.key}`" class="px-0 py-1" min-height="28px">
                <v-list-item-title>{{ metodo.label }}: <strong>{{ metodo.prefix }} {{ formatCurrency(sesionActual.montos_apertura[metodo.key]) }}</strong></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-alert>

          <!-- Estado: Caja Ocupada por otro usuario -->
          <v-alert v-else-if="cajaOcupada" type="info" variant="tonal" icon="mdi-account-lock-outline" border="start">
            <h3 class="mb-2">Caja en Uso</h3>
            <p>La caja está actualmente abierta y siendo gestionada por <strong>{{ sesionActual.nombre_usuario }}</strong>.</p>
            <p>No puedes realizar acciones hasta que la sesión actual sea cerrada por un administrador.</p>
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
          v-if="!cajaAbierta && !cajaOcupada"
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
          <p class="mb-4">Introduce los montos iniciales para cada método de pago.</p>
          <v-text-field
            v-for="metodo in metodosDePago"
            :key="`input-apertura-${metodo.key}`"
            v-model.number="montosApertura[metodo.key]"
            :label="metodo.label"
            type="number"
            :prefix="metodo.prefix"
            variant="outlined"
            class="mb-2"
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
          <p class="mb-4">Realiza el conteo y registra los montos finales para cada método de pago.</p>
          <v-text-field
            v-for="metodo in metodosDePago"
            :key="`input-cierre-${metodo.key}`"
            v-model.number="montosCierreReal[metodo.key]"
            :label="metodo.label"
            type="number"
            :prefix="metodo.prefix"
            variant="outlined"
            class="mb-2"
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
const esAdmin = ref(true); // TODO: Cambiar por la lógica real de roles

const metodosDePago = ref([
  { key: 'dolares_efectivo', label: 'Dólares (Efectivo)', prefix: '$' },
  { key: 'bolivares_efectivo', label: 'Bolívares (Efectivo)', prefix: 'Bs.' },
  { key: 'transferencia', label: 'Transferencia (Bs.)', prefix: 'Bs.' },
  { key: 'pago_movil', label: 'Pago Móvil (Bs.)', prefix: 'Bs.' },
  { key: 'zelle', label: 'Zelle ($)', prefix: '$' },
  { key: 'punto_a', label: 'Punto de Venta A (Bs.)', prefix: 'Bs.' },
  { key: 'punto_b', label: 'Punto de Venta B (Bs.)', prefix: 'Bs.' },
]);

const getInitialMontos = () => metodosDePago.value.reduce((acc, metodo) => {
  acc[metodo.key] = 0;
  return acc;
}, {});

const montosApertura = ref(getInitialMontos());
const montosCierreReal = ref(getInitialMontos());

const loading = ref(true);
const actionLoading = ref(false);
const cajaAbierta = ref(false);
const cajaOcupada = ref(false); // Nuevo estado para caja en uso por otro
const sesionActual = ref(null);
const snackbar = ref({ show: false, text: '', color: 'success' });

const dialogAbrir = ref(false);
const dialogCerrar = ref(false);
const notasCierre = ref('');

const fetchEstadoCaja = async () => {
  loading.value = true;
  try {
    const { data } = await cajaService.getEstado();
    cajaAbierta.value = data.estado === 'ABIERTA';
    cajaOcupada.value = data.estado === 'ABIERTA_POR_OTRO';
    sesionActual.value = data.sesion;
  } catch (error) {
    showSnackbar('Error al consultar el estado de la caja.', 'error');
  } finally {
    loading.value = false;
  }
};

const handleAbrirCaja = async () => {
  actionLoading.value = true;
  try {
    await cajaService.abrirCaja({ montos_apertura: montosApertura.value });
    showSnackbar('Caja abierta exitosamente.', 'success');
    dialogAbrir.value = false;
    montosApertura.value = getInitialMontos(); // Resetear formulario
    await fetchEstadoCaja(); // Refrescar estado
  } catch (error) {
    showSnackbar(error.response?.data?.message || 'Error al abrir la caja.', 'error');
  } finally {
    actionLoading.value = false;
  }
};

const handleCerrarCaja = async () => {
  actionLoading.value = true;
  try {
    const datosCierre = {
      montos_cierre_real: montosCierreReal.value,
      notas: notasCierre.value,
    };
    await cajaService.cerrarCaja(datosCierre);
    showSnackbar('Caja cerrada exitosamente.', 'success');
    dialogCerrar.value = false;
    notasCierre.value = '';
    montosCierreReal.value = getInitialMontos(); // Resetear formulario
    await fetchEstadoCaja(); // Refrescar estado
  } catch (error) {
    showSnackbar(error.response?.data?.message || 'Error al cerrar la caja.', 'error');
  } finally {
    actionLoading.value = false;
  }
};

const showSnackbar = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Caracas' // Ajustar a la zona horaria local
  };
  return new Date(dateString).toLocaleString('es-VE', options);
};

const formatCurrency = (value) => {
  const num = Number(value);
  if (isNaN(num)) {
    return '0.00';
  }
  return num.toFixed(2);
};

onMounted(fetchEstadoCaja);
</script>

<style scoped>
.transparent-list {
  background-color: transparent !important;
}
.transparent-list .v-list-item {
  min-height: 28px;
}
</style>
