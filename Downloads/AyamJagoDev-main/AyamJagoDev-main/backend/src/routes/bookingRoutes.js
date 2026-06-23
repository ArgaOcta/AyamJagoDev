const express = require('express');
const router = express.Router();

const {
    processBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    cancelBooking,
    updateBooking
} = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', (req, res) => {
    res.send('Booking API berjalan');
});

// Route untuk User Frontend
router.post('/', processBooking);

// Route untuk Admin Dashboard
router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

router.post(
    '/',
    authMiddleware,
    authorize(['admin', 'user']),
    processBooking
);
router.patch(
    '/cancel/:id',
    authMiddleware,
    authorize(['admin', 'user']),
    cancelBooking
);

router.put(
    '/update/:id',
    authMiddleware,
    authorize(['admin', 'user']),
    updateBooking
);

//ini semisal gak jalan untuk backup router aja
//bookingController.getBookingById (ini dpakai semisal router post baris 8-12 tidak berfungsi)
module.exports = router;