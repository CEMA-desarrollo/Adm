// 1. Importar las dependencias
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session); // <-- Importamos el gestor de sesiones en archivo
const path = require('path'); // <-- Importar el módulo 'path' de Node.js

// 2. Importar módulos de la aplicación
const dbPool = require('./config/db');
const ensureAdminUser = require('./config/ensureAdmin');

// Importamos todas las rutas de la aplicación
const userRoutes = require('./routes/userRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const tratamientoRoutes = require('./routes/tratamientoRoutes');
const especialidadRoutes = require('./routes/especialidadRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');

// 3. Configuración inicial de Express
const app = express();
const PORT = process.env.API_PORT || 3000;

// 4. Middlewares
const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_NETWORK_URL) {
  allowedOrigins.push(process.env.FRONTEND_NETWORK_URL);
}
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Hacer que la carpeta 'public' sea accesible públicamente
app.use('/public', express.static('public'));

// --- Configuración de express-session ---
app.use(session({
  // Usamos FileStore para guardar sesiones en archivos en lugar de en memoria
  store: new FileStore({
    path: path.join(__dirname, 'sessions'), // Usar una ruta absoluta para mayor robustez
    ttl: 86400, // Tiempo de vida de la sesión en segundos (1 día)
    retries: 5, // Aumentar el número de reintentos
    logFn: function(msg) { console.log('[SESSION_DEBUG]', msg); } // Añadir logging detallado
  }),
  secret: process.env.SESSION_SECRET || 'un_secreto_muy_seguro_y_largo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));
// --- Fin de la configuración de express-session ---

// 5. Definición de las rutas de la API
app.get('/', (req, res) => {
  res.send('¡El servidor SIGFAC está funcionando correctamente!');
});

app.use('/api/users', userRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/bitacora', bitacoraRoutes);

// 6. Inicio del servidor
const startServer = async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ Conexión a la base de datos establecida con éxito.');
    connection.release();

    await ensureAdminUser();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT} y en la red local.`);
    });
  } catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Asegúrate de que el servicio de base de datos (MySQL/MariaDB) esté corriendo y que las credenciales en .env son correctas.');
    }
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
