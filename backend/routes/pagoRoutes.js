const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

// Rutas para Pagos
router.get('/', isAuthenticated, pagoController.getAllPagos);
router.get('/:id', isAuthenticated, pagoController.getPagoById);
router.post('/', isAuthenticated, authorizeRole(['Administrador', 'Recepción', 'Encargado']), pagoController.createPago);
router.put('/:id', isAuthenticated, authorizeRole(['Administrador', 'Recepción', 'Encargado']), pagoController.updatePago);
router.delete('/:id', isAuthenticated, authorizeRole(['Administrador']), pagoController.deletePago);

module.exports = router;