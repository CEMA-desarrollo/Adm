const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// Using authorizeRole directly for clarity, isAdmin could be deprecated
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

// =================================================================
// Rutas de Autenticación (Públicas o semi-públicas)
// =================================================================
router.post('/login', userController.login);
router.post('/logout', isAuthenticated, userController.logout); // Logout también debe estar protegido

// NUEVA RUTA: Para que el frontend verifique si hay una sesión activa al recargar la página.
router.get('/profile', isAuthenticated, userController.getProfile);

// =================================================================
// Rutas de Gestión de Usuarios (Protegidas y solo para Administrador)
// =================================================================
router.get('/', isAuthenticated, authorizeRole(['Administrador']), userController.getAllUsers);
router.post('/', isAuthenticated, authorizeRole(['Administrador']), userController.createUser);
router.put('/:id', isAuthenticated, authorizeRole(['Administrador']), userController.updateUser);
router.delete('/:id', isAuthenticated, authorizeRole(['Administrador']), userController.deleteUser);

module.exports = router;