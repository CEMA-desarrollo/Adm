// d:\Code\Adm\backend\config\ensureAdmin.js
require('dotenv').config(); // Asegura que las variables de entorno estén cargadas
const User = require('../models/userModel');

/**
 * @summary Asegura que el usuario 'admin' exista en la base de datos al iniciar el servidor.
 * @description Si el usuario 'admin' no existe, lo crea utilizando la contraseña
 *              definida en la variable de entorno DEFAULT_ADMIN_PASSWORD.
 *              ADVERTENCIA: La contraseña se guarda en texto plano.
 */
async function ensureAdminUser() {
  try {
    const adminUsername = 'admin';
    const existingAdmin = await User.findByUsername(adminUsername);

    if (!existingAdmin) {
      console.log(`[ADMIN_SETUP] Usuario "${adminUsername}" no encontrado. Creándolo...`);
      
      // Usa la contraseña del .env o una por defecto si no está definida.
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'adminpass123';

      await User.create({
        nombre_usuario: adminUsername,
        nombre: 'Admin', // Default nombre
        apellido: 'User', // Default apellido
        fecha_nacimiento: null, // Default
        url_imagen: null, // Default
        password: adminPassword, // Changed from hash_contrasena
        rol: 'admin'
      });

      console.log(`[ADMIN_SETUP] Usuario "${adminUsername}" creado con éxito con nombre y apellido por defecto.`);
      console.warn(`[SECURITY_WARNING] La contraseña del administrador ("${adminPassword}") se ha guardado en texto plano.`);
    } else {
      console.log(`[ADMIN_SETUP] El usuario "${adminUsername}" ya existe. No se realizaron cambios.`);
    }
  } catch (error) {
    console.error('[ADMIN_SETUP_FATAL] Error fatal al asegurar la existencia del usuario admin:', error);
    // Es un error crítico, detenemos el servidor para evitar un estado inconsistente.
    process.exit(1); 
  }
}

module.exports = ensureAdminUser;