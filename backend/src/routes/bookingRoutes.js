const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.post('/', authMiddleware, bookingController.processBooking);
router.get('/', authMiddleware, authorize(['admin']), bookingController.getAllBookings);

module.exports = router;