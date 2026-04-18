const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// semua user boleh lihat kendaraan
router.get('/', authMiddleware, authorize(['admin', 'user']), vehicleController.getAllVehicles);

module.exports = router;