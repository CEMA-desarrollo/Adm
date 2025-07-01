<template>
  <v-container class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card class="mx-auto pa-4 pa-md-8" rounded="lg" elevation="8" max-width="500">
          <v-card-title class="text-h4 text-center font-weight-bold text-primary">
            SIGFAC
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Bienvenido, por favor inicia sesión
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Nombre de usuario"
                variant="outlined"
                prepend-inner-icon="mdi-account-outline"
                type="text"
                required
                class="mb-4"
                @keyup.enter="handleLogin"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                required
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
                @keyup.enter="handleLogin"
              ></v-text-field>

              <div class="text-right mb-4">
                <a href="#" class="text-caption text-decoration-none text-primary">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <v-alert v-if="error" type="error" variant="tonal" dense class="mb-4">
                {{ error }}
              </v-alert>

              <v-btn
                :loading="loading"
                :disabled="loading"
                block
                color="primary"
                size="large"
                type="submit"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService.js';

const username = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);
const showPassword = ref(false);
const router = useRouter();

async function handleLogin() {
  error.value = null; // Limpiar errores previos
  if (!username.value || !password.value) {
    error.value = 'Por favor, ingresa usuario y contraseña.';
    return;
  }

  loading.value = true;
  try {
    await authService.login({
      nombre_usuario: username.value,
      password: password.value,
    });
    // Redirigir al dashboard o página principal
    router.push('/');
  } catch (err) {
    console.error('Error de login:', err);
    error.value = err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
  } finally {
    loading.value = false;
  }
}
</script>