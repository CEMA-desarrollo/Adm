const express = require('express');
const router = express.Router();
const tasaCambioController = require('../controllers/tasaCambioController');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

// Rutas para las tasas de cambio
router.get('/', isAuthenticated, tasaCambioController.getAllTasas);
router.post('/', isAuthenticated, hasRole(['Administrador']), tasaCambioController.createTasa);

module.exports = router;