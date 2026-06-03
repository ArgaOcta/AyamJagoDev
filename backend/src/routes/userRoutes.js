const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/profile', authMiddleware, authorize(['admin', 'user']), userController.getUserProfile);

module.exports = router;
router.put('/profile', authMiddleware, authorize(['admin', 'user']), userController.updateUserProfile);
router.put('/avatar', authMiddleware, authorize(['admin', 'user']), userController.updateAvatar);
router.put('/password', authMiddleware, authorize(['admin', 'user']), userController.changeUserPassword);
router.delete('/profile', authMiddleware, authorize(['admin', 'user']), userController.deleteUserAccount);

module.exports = router;
