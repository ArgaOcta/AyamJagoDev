const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/stats', authMiddleware, authorize(['admin']), dashboardController.getDashboardStats);

module.exports = router;