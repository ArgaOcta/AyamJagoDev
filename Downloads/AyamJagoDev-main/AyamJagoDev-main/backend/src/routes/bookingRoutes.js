const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', (req, res) => {
    res.send('Booking API berjalan');
});

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

router.put('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

//ini semisal gak jalan untuk backup router aja
//bookingController.getBookingById (ini dpakai semisal router post baris 8-12 tidak berfungsi)
module.exports = router;