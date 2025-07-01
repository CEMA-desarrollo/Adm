const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Todas las rutas de servicios requieren que el usuario esté autenticado
router.use(isAuthenticated);

// GET /api/servicios -> Obtener todos los servicios
router.get('/', servicioController.getAllServicios);

// POST /api/servicios -> Crear un nuevo servicio (solo para administradores)
router.post('/', isAdmin, servicioController.createServicio);

// PUT /api/servicios/:id -> Actualizar un servicio (solo para administradores)
router.put('/:id', isAdmin, servicioController.updateServicio);

// DELETE /api/servicios/:id -> Desactivar un servicio (borrado lógico)
router.delete('/:id', isAdmin, servicioController.deleteServicio);

// DELETE /api/servicios/:id/permanent -> Eliminar permanentemente un servicio
router.delete('/:id/permanent', isAdmin, servicioController.deleteServicioPermanently);

module.exports = router;
