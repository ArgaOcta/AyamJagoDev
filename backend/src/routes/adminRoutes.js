const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { getAllHistoryForAdmin } = require('../controllers/adminController');


// Admin: semua riwayat/booking
router.get('/history', authMiddleware, authorize(['admin']), getAllHistoryForAdmin);

module.exports = router;

