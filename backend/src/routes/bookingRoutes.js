const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.post(
    '/',
    authMiddleware,
    authorize(['admin', 'user']),
    bookingController.processBooking
);
router.patch(
    '/cancel/:id',
    authMiddleware,
    authorize(['admin', 'user']),
    bookingController.cancelBooking
);

router.put(
    '/update/:id',
    authMiddleware,
    authorize(['admin', 'user']),
    bookingController.updateBooking
);

//ini semisal gak jalan untuk backup router aja
//bookingController.getBookingById (ini dpakai semisal router post baris 8-12 tidak berfungsi)
module.exports = router;