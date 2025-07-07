// tratamientoRoutes.js
const express = require('express');
const router = express.Router();
const tratamientoController = require('../controllers/tratamientoController'); // <-- Aquí importas el controlador
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, tratamientoController.getAllTratamientos);
router.get('/:id', isAuthenticated, tratamientoController.getTratamientoById);
router.post('/', isAuthenticated, authorizeRole(['admin', 'recepcionista']), tratamientoController.createTratamiento);
router.put('/:id', isAuthenticated, authorizeRole(['admin', 'recepcionista']), tratamientoController.updateTratamiento); // <-- Línea 9
router.delete('/:id', isAuthenticated, authorizeRole(['admin']), tratamientoController.deleteTratamiento); // deleteTratamiento is now Cancel

module.exports = router;
