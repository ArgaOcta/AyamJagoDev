const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { getAllHistoryForAdmin } = require('../controllers/adminController');
const { listUsers, createAdmin, updateUserRole, setBlockStatus } = require('../controllers/adminController');


// Admin: semua riwayat/booking
router.get('/history', authMiddleware, authorize(['admin']), getAllHistoryForAdmin);

// Admin: user management - hanya Super Admin
router.get('/users', authMiddleware, authorize(['superadmin']), listUsers);
router.post('/users', authMiddleware, authorize(['superadmin']), createAdmin);
router.put('/users/:id/role', authMiddleware, authorize(['superadmin']), updateUserRole);
router.put('/users/:id/block', authMiddleware, authorize(['superadmin']), setBlockStatus);

module.exports = router;

