const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

// Rutas para Pagos
router.get('/', isAuthenticated, pagoController.getAllPagos);
router.get('/:id', isAuthenticated, pagoController.getPagoById);
router.post('/', isAuthenticated, authorizeRole(['admin', 'recepcionista']), pagoController.createPago);
router.put('/:id', isAuthenticated, authorizeRole(['admin', 'recepcionista']), pagoController.updatePago);
router.delete('/:id', isAuthenticated, authorizeRole(['admin']), pagoController.deletePago);

module.exports = router;