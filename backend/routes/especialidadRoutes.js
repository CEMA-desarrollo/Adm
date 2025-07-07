const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

// Rutas para la gestión de Especialidades
router.get('/', isAuthenticated, especialidadController.getAllEspecialidades);
router.get('/:id', isAuthenticated, especialidadController.getEspecialidadById);
router.post('/', isAuthenticated, authorizeRole(['Administrador']), especialidadController.createEspecialidad);
router.put('/:id', isAuthenticated, authorizeRole(['Administrador']), especialidadController.updateEspecialidad);
// Ruta para la eliminación lógica (desactivación)
router.delete('/:id', isAuthenticated, authorizeRole(['Administrador']), especialidadController.deleteEspecialidad);

module.exports = router;