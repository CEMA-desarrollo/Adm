// tratamientoRoutes.js
const express = require('express');
const router = express.Router();
const tratamientoController = require('../controllers/tratamientoController'); // <-- Aquí importas el controlador
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, tratamientoController.getAllTratamientos);
router.get('/:id', isAuthenticated, tratamientoController.getTratamientoById);
router.post('/', isAuthenticated, authorizeRole(['Administrador', 'Recepción', 'Encargado']), tratamientoController.createTratamiento);
router.put('/:id', isAuthenticated, authorizeRole(['Administrador', 'Recepción', 'Encargado']), tratamientoController.updateTratamiento); // <-- Línea 9
router.delete('/:id', isAuthenticated, authorizeRole(['Administrador']), tratamientoController.deleteTratamiento); // deleteTratamiento is now Cancel

module.exports = router;
