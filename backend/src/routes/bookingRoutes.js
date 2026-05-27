const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.post('/', authMiddleware, authorize(['admin', 'user']), bookingController.processBooking);

module.exports = router;