<template>
  <v-container>
    <!-- Notificación Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom end">
      {{ snackbar.text }}
    </v-snackbar>

    <v-card class="mx-auto" style="min-width: 450px; max-width: 800px;">
      <v-card-title class="headline">
        Editar Perfil
      </v-card-title>
      <v-card-subtitle>
        Actualiza tu información personal y foto de perfil.
      </v-card-subtitle>

      <v-card-text>
        <div class="mt-4">
          <v-form @submit.prevent="handleSave">
              <v-text-field
                v-model="form.nombre"
                label="Nombre"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="form.apellido"
                label="Apellido"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              <!-- Campo de Fecha de Nacimiento con Date Picker -->
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
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    class="mb-2"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_nacimiento"
                  @update:modelValue="dateMenu = false"
                  title="Seleccione la fecha"
                  color="primary"
                ></v-date-picker>
              </v-menu>
              <v-text-field
                v-model="form.rol"
                label="Rol"
                variant="outlined"
                disabled
              ></v-text-field>
            </v-form>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="handleSave" :loading="loadingSave">
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import authService from '@/services/authService';

const dateMenu = ref(false);
const loadingSave = ref(false); // Para mostrar un estado de carga en el botón
const snackbar = ref({ show: false, text: '', color: 'success' });

// Estado reactivo para el formulario
const form = ref({
  nombre: '',
  apellido: '',
  fecha_nacimiento: null, // Usará un objeto Date
  rol: '',
});

// Formatea la fecha para mostrarla en el campo de texto
const formattedDate = computed(() => {
  if (!form.value.fecha_nacimiento) return '';
  // El valor del v-date-picker es un objeto Date
  return new Date(form.value.fecha_nacimiento).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

// Cargar los datos del usuario cuando el componente se monta
onMounted(() => {
  const user = authService.user.value;
  if (user) {
    // Hacemos la carga de datos más robusta, asignando valores por defecto
    // si alguna propiedad no está definida en el objeto de usuario.
    form.value.nombre = user.nombre || '';
    form.value.apellido = user.apellido || '';
    // Si la fecha viene como string 'YYYY-MM-DD', la convertimos a objeto Date para el picker
    if (user.fecha_nacimiento) {
      // Añadimos 'T00:00:00' para evitar problemas de zona horaria que resten un día
      const dateString = `${user.fecha_nacimiento}T00:00:00`;
      const parts = dateString.split('T')[0].split('-');
      form.value.fecha_nacimiento = new Date(parts[0], parts[1] - 1, parts[2]);
    }
    form.value.rol = user.rol || 'N/A';
  }
});

const showSnackbar = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const handleSave = async () => {
  loadingSave.value = true;

  const profileData = {
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    fecha_nacimiento: null,
  };

  // Formateamos la fecha a 'YYYY-MM-DD' para el backend
  if (form.value.fecha_nacimiento) {
    const date = new Date(form.value.fecha_nacimiento);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - userTimezoneOffset);
    profileData.fecha_nacimiento = adjustedDate.toISOString().split('T')[0];
  }

  try {
    const response = await authService.updateProfile(profileData);
    showSnackbar(response.message || 'Perfil actualizado con éxito');
  } catch (error) {
    // Manejo de errores mejorado para dar más detalles
    console.error("Error detallado al guardar perfil:", error);
    let errorMessage = 'Error al actualizar el perfil.';
    if (error.response) {
      // El servidor respondió con un error (ej. 400, 404, 500)
      errorMessage = error.response.data.message || `Error del servidor: ${error.response.status}`;
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta (ej. problema de red, CORS)
      errorMessage = 'No se pudo conectar con el servidor. Revisa tu conexión y la URL del API.';
    }
    showSnackbar(errorMessage, 'error');
  } finally {
    loadingSave.value = false;
  }
};
</script>