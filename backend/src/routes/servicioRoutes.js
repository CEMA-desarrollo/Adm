const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// Asumo que tienes un middleware para verificar el token y el rol de admin
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- Rutas para Servicios ---

// GET /api/servicios - Obtiene todos los servicios.
// Accesible para cualquier usuario autenticado (admin, recepcionista).
router.get('/', verifyToken, servicioController.getAllServicios);

// Rutas que requieren permisos de administrador
router.post('/', verifyToken, isAdmin, servicioController.createServicio);
router.put('/:id', verifyToken, isAdmin, servicioController.updateServicio);
router.delete('/:id', verifyToken, isAdmin, servicioController.deleteServicio);

module.exports = router;