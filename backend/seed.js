require('dotenv').config(); // Carga las variables de entorno
const { dbPool } = require('./config/db'); // Importa el pool de la base de datos
const User = require('./models/userModel'); // Importa el modelo de usuario

const seedDatabase = async () => {
  try {
    console.log('Iniciando el sembrado de datos...');

    // --- Crear Usuario Administrador por defecto ---
    const defaultAdminUsername = 'admin';
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'adminpass'; // Usar variable de entorno, con fallback para desarrollo
    const defaultAdminRole = 'admin';

    // Verificar si el usuario ya existe
    const existingAdmin = await User.findByUsername(defaultAdminUsername);

    if (existingAdmin) {
      console.log(`Usuario '${defaultAdminUsername}' ya existe. Saltando creación.`);
    } else {
      await User.create({
        nombre_usuario: defaultAdminUsername,
        hash_contrasena: defaultAdminPassword, // Guardar contraseña en texto plano
        rol: defaultAdminRole
      });
      console.log(`Usuario '${defaultAdminUsername}' creado exitosamente.`);
    }

    console.log('Sembrado de datos completado.');
  } catch (error) {
    console.error('Error durante el sembrado de datos:', error);
    process.exit(1); // Salir con error si algo falla
  } finally {
    // Cerrar la conexión a la base de datos
    if (dbPool) {
      await dbPool.end();
      console.log('Conexión a la base de datos cerrada.');
    }
  }
};

// Ejecutar el script de sembrado
seedDatabase();