const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware'); // Changed isAdmin to authorizeRole

// Todas las rutas de servicios requieren que el usuario esté autenticado
router.use(isAuthenticated);

// GET /api/servicios -> Obtener todos los servicios
router.get('/', servicioController.getAllServicios);

// POST /api/servicios -> Crear un nuevo servicio (solo para Administrador)
router.post('/', authorizeRole(['Administrador']), servicioController.createServicio);

// PUT /api/servicios/:id -> Actualizar un servicio (solo para Administrador)
router.put('/:id', authorizeRole(['Administrador']), servicioController.updateServicio);

// DELETE /api/servicios/:id -> Desactivar un servicio (borrado lógico - solo para Administrador)
router.delete('/:id', authorizeRole(['Administrador']), servicioController.deleteServicio);

// DELETE /api/servicios/:id/permanent -> Eliminar permanentemente un servicio (solo para Administrador)
router.delete('/:id/permanent', authorizeRole(['Administrador']), servicioController.deleteServicioPermanently);

module.exports = router;
