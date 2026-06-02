const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
<<<<<<< HEAD

router.post('/', bookingController.processBooking);
=======
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.post('/', authMiddleware, authorize(['admin', 'user']), bookingController.processBooking);
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd

module.exports = router;