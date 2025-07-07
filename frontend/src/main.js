import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css';

// Vue Router
import router from './router'; // Importa el archivo de configuración de rutas
import authService from './services/authService';

/**
 * Función asíncrona para inicializar y montar la aplicación.
 * Esto asegura que la verificación de la sesión se complete ANTES de que se renderice la app.
 */
async function initializeApp() {
  try {
    // 1. Llama a `initializeAuth` y espera a que resuelva.
    // Esto consultará al backend y establecerá el estado de `isAuthenticated` en authService.
    await authService.initializeAuth();

    // 2. Crea la instancia de la app.
    const app = createApp(App);

    // 3. Configura los plugins.
    const vuetify = createVuetify({
      components,
      directives,
    });
    app.use(router);
    app.use(vuetify);

    // 4. Monta la aplicación solo después de que todo esté listo.
    app.mount('#app');
  } catch (error) {
    console.error("Error fatal durante la inicialización de la aplicación:", error);
    // En caso de un error irrecuperable, muestra un mensaje al usuario.
    document.getElementById('app').innerHTML = '<div style="text-align: center; padding-top: 50px;"><h1>Error al cargar la aplicación</h1><p>Por favor, intente refrescar la página o contacte al soporte.</p></div>';
  }
}

initializeApp();
