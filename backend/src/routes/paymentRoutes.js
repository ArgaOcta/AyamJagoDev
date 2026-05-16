const express = require('express');
const router = express.Router();

const { validatePayment } = require('../middlewares/paymentValidation');
const bookingController = require('../controllers/bookingController');

// endpoint payment
router.post('/', validatePayment, bookingController.processBooking);

module.exports = router;