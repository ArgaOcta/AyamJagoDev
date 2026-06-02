const express = require('express');
const router = express.Router();

<<<<<<< HEAD
=======
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd
const { validatePayment } = require('../middlewares/paymentValidation');
const bookingController = require('../controllers/bookingController');

// endpoint payment
<<<<<<< HEAD
router.post('/', validatePayment, bookingController.processBooking);
=======
router.post('/', authMiddleware, authorize(['admin', 'user']), validatePayment, bookingController.processBooking);
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd

module.exports = router;