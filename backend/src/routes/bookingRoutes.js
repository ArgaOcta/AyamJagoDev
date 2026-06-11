const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');

router.get('/', (req, res) => {
    res.send('Booking API berjalan');
});

router.post('/', bookingController.processBooking);
const { 
    processBooking, 
    getAllBookings, 
    updateBookingStatus, 
    deleteBooking 
} = require('../controllers/bookingController');

// Route untuk User Frontend
router.post('/', processBooking);

// Route untuk Admin Dashboard
router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

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