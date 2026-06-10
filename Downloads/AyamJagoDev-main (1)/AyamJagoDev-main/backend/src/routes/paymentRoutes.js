const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { validatePayment } = require('../middlewares/paymentValidation');
const bookingController = require('../controllers/bookingController');

// endpoint payment
router.post('/', validatePayment, bookingController.processBooking);
router.post('/', authMiddleware, authorize(['admin', 'user']), validatePayment, bookingController.processBooking);

module.exports = router;