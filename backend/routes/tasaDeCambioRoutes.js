const express = require('express');
const router = express.Router();
const { getAllTasas, getLatestTasa, createOrUpdateTasa } = require('../controllers/tasaDeCambioController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

router.get('/latest', isAuthenticated, getLatestTasa);
router.get('/', isAuthenticated, getAllTasas);
router.post('/', isAuthenticated, authorizeRole(['Administrador']), createOrUpdateTasa);

module.exports = router;
