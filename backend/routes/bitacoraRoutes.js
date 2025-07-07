const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

// Ruta para obtener los logs, solo para Administrador
router.get('/', isAuthenticated, authorizeRole(['admin']), bitacoraController.getLogs);

module.exports = router;