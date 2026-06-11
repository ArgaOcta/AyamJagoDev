const express = require('express');
const router = express.Router();
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

module.exports = router;