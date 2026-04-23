const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', vehicleController.getAllVehicles);

router.get('/:id', vehicleController.getVehicleById);

module.exports = router;