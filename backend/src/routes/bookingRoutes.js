const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const bookingController = require('../controllers/bookingController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/'); 
  },
  filename: (req, file, cb) => {
    cb(null, 'proof-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.get('/test', (req, res) => {
    res.send('Booking API berjalan dengan aman');
});

router.post(
    '/',
    authMiddleware,
    authorize(['admin', 'user']),
    upload.single('proof_of_payment'), // Middleware penangkap file gambar
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