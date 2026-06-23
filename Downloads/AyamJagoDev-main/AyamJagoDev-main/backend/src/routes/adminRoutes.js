const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const {
  getAllHistoryForAdmin,
  getAllUsers,
  createUser,
  updateUserRole,
  setUserBlockStatus,
  deleteUser,
} = require('../controllers/adminController');

// Admin: semua riwayat/booking
router.get('/history', authMiddleware, authorize(['admin']), getAllHistoryForAdmin);

// Admin: manajemen pengguna
router.get('/users', authMiddleware, authorize(['admin']), getAllUsers);
router.post('/users', authMiddleware, authorize(['admin']), createUser);
router.put('/users/:id/role', authMiddleware, authorize(['admin']), updateUserRole);
router.put('/users/:id/block', authMiddleware, authorize(['admin']), setUserBlockStatus);
router.delete('/users/:id', authMiddleware, authorize(['admin']), deleteUser);

module.exports = router;

