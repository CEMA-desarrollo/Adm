const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');
const uploadAvatar = require('../middleware/multerConfig'); // Importar configuración de Multer

// =================================================================
// Rutas de Autenticación y Perfil de Usuario
// =================================================================
router.post('/login', userController.login);
router.post('/logout', isAuthenticated, userController.logout);

// Ruta para verificar la sesión activa. Esencial para la inicialización del frontend.
router.get('/check-session', isAuthenticated, (req, res) => {
  // Si la petición llega aquí, `isAuthenticated` ya validó la sesión.
  // Devolvemos el usuario guardado en la sesión.
  res.status(200).json({ user: req.session.user });
});

// Perfil de usuario
router.get('/profile', isAuthenticated, userController.getProfile);
router.put(
  '/profile',
  isAuthenticated,
  uploadAvatar.single('avatar'), // Middleware de Multer para un solo archivo llamado 'avatar'
  userController.updateProfile // Nueva función en el controlador
);

// =================================================================
// Rutas de Gestión de Usuarios (Protegidas y solo para Administrador)
// =================================================================

router.get('/', isAuthenticated, authorizeRole(['Administrador']), userController.getAllUsers);
router.post('/', isAuthenticated, authorizeRole(['Administrador']), userController.createUser);
router.put('/:id', isAuthenticated, authorizeRole(['Administrador']), userController.updateUser); // Esta es para que un admin actualice CUALQUIER usuario
router.delete('/:id', isAuthenticated, authorizeRole(['Administrador']), userController.deleteUser);

module.exports = router;