const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/test', (req, res) => {
    res.send('Booking API berjalan dengan aman');
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

router.get(
    '/admin',
    authMiddleware,
    authorize(['admin']),
    bookingController.getAllBookings
);

router.put(
    '/:id/status',
    authMiddleware,
    authorize(['admin']),
    bookingController.updateBookingStatus
);

router.delete(
    '/:id',
    authMiddleware,
    authorize(['admin']),
    bookingController.deleteBooking
);

module.exports = router;