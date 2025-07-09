import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Redirige cualquier petición que comience con /api a tu servidor backend
      '/api': {
        target: 'http://localhost:3000', // La URL de tu servidor backend
        changeOrigin: true, // Necesario para hosts virtuales
      },
    },
  },
});