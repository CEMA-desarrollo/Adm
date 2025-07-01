const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

// IMPORTANTE: Esta ruta debe ir ANTES de /:id para que "buscar" no se interprete como un id.
router.get('/buscar', isAuthenticated, pacienteController.searchPacientes);

router.get('/', isAuthenticated, pacienteController.getAllPacientes);
router.get('/:id', isAuthenticated, pacienteController.getPacienteById);
router.post('/', isAuthenticated, authorizeRole(['admin', 'recepcionista']), pacienteController.createPaciente);
router.put('/:id', isAuthenticated, authorizeRole(['admin', 'recepcionista']), pacienteController.updatePaciente);
router.delete('/:id', isAuthenticated, authorizeRole(['admin']), pacienteController.deletePaciente);

module.exports = router;
