const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directorio de subida
const uploadDir = 'backend/public/uploads/avatars/';

// Asegurarse de que el directorio de subida exista
// Esto se hizo en el paso anterior con `run_in_bash_session`, pero es bueno tenerlo aquí por si acaso.
fs.mkdirSync(uploadDir, { recursive: true });

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // El ID de usuario se tomará de la sesión/token en el controlador de la ruta.
    // El nombre de archivo final será user-[id]-[timestamp].ext
    // Multer no tiene acceso directo al req.session.user.id aquí de forma fiable antes de isAuthenticated.
    // Por lo tanto, generaremos un nombre temporal y el controlador se encargará del nombre final.
    const tempSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    // Nombre temporal, el controlador lo renombrará.
    cb(null, `temp-${file.fieldname}-${tempSuffix}${extension}`);
  }
});

// Filtro de archivos para aceptar solo imágenes
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Rechazar archivo y pasar un error personalizado
    // Este error se puede capturar en un middleware de manejo de errores de Multer si es necesario.
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Solo se permiten archivos de imagen (image/jpeg, image/png, etc).'), false);
  }
};

const uploadAvatar = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limitar tamaño a 5MB (5 megabytes)
  }
});

module.exports = uploadAvatar;
