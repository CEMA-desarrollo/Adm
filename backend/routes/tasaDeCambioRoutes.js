const express = require('express');
const router = express.Router();
const tasaDeCambioController = require('../controllers/tasaDeCambioController');
const { isAuthenticated, authorizeRole } = require('../middleware/authMiddleware');

router.get('/latest', isAuthenticated, tasaDeCambioController.getLatestTasa);
router.get('/', isAuthenticated, tasaDeCambioController.getAllTasas);
router.post('/', isAuthenticated, authorizeRole(['admin']), tasaDeCambioController.createTasa);

module.exports = router;
