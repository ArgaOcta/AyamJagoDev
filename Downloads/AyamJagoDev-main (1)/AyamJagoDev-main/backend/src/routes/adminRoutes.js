const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { getAllHistoryForAdmin, createAdmin, changeUserRole, setUserBlocked, getAllUsers } = require('../controllers/adminController');


// Admin: semua riwayat/booking
router.get('/history', authMiddleware, authorize(['admin','superadmin']), getAllHistoryForAdmin);

// list users (admin + superadmin)
router.get('/users', authMiddleware, authorize(['admin','superadmin']), getAllUsers);

// Admin: create another admin (Super Admin only)
router.post('/create-admin', authMiddleware, authorize(['superadmin']), createAdmin);

// Admin: change role for a user (Super Admin only)
router.put('/users/:id/role', authMiddleware, authorize(['superadmin']), changeUserRole);

// Admin: block/unblock user (Admin + Super Admin)
router.put('/users/:id/block', authMiddleware, authorize(['admin','superadmin']), setUserBlocked);

module.exports = router;

