const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

const multer = require('multer');
const path = require('path');

// ==========================
// MULTER CONFIG
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ==========================
// ROUTES
// ==========================

router.get(
  '/profile',
  authMiddleware,
  authorize(['admin', 'user']),
  userController.getUserProfile
);

router.put(
  '/profile',
  authMiddleware,
  authorize(['admin', 'user']),
  userController.updateUserProfile
);

// 🔥 FIX AVATAR (PAKAI MULTER)
router.put(
  '/avatar',
  authMiddleware,
  authorize(['admin', 'user']),
  upload.single('avatar'),
  userController.updateAvatar
);

router.put(
  '/password',
  authMiddleware,
  authorize(['admin', 'user']),
  userController.changeUserPassword
);

router.delete(
  '/profile',
  authMiddleware,
  authorize(['admin', 'user']),
  userController.deleteUserAccount
);

module.exports = router;