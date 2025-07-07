const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, proveedorController.getAllProveedores);
router.get('/:id', isAuthenticated, proveedorController.getProveedorById);
router.post('/', isAuthenticated, authorizeRole(['Administrador']), proveedorController.createProveedor);
router.put('/:id', isAuthenticated, authorizeRole(['Administrador']), proveedorController.updateProveedor);
router.delete('/:id', isAuthenticated, authorizeRole(['Administrador']), proveedorController.deleteProveedor);

// Ruta para eliminación permanente
router.delete('/:id/permanent', isAuthenticated, authorizeRole(['Administrador']), proveedorController.deleteProveedorPermanently);

// Rutas para gestionar los servicios asociados a un proveedor
router.get('/:id/servicios', isAuthenticated, proveedorController.getProveedorServicios);
router.put('/:id/servicios', isAuthenticated, authorizeRole(['Administrador']), proveedorController.updateProveedorServicios); // Para actualizar en bloque

module.exports = router;
