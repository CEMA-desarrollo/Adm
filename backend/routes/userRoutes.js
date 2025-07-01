const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// =================================================================
// Rutas de Autenticación (Públicas o semi-públicas)
// =================================================================
router.post('/login', userController.login);
router.post('/logout', isAuthenticated, userController.logout); // Logout también debe estar protegido

// NUEVA RUTA: Para que el frontend verifique si hay una sesión activa al recargar la página.
router.get('/profile', isAuthenticated, userController.getProfile);

// =================================================================
// Rutas de Gestión de Usuarios (Protegidas y solo para Admin)
// =================================================================
router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.post('/', isAuthenticated, isAdmin, userController.createUser);
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;