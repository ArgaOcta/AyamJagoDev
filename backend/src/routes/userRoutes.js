const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/profile', authMiddleware, authorize(['admin', 'user']), userController.getUserProfile);

module.exports = router;