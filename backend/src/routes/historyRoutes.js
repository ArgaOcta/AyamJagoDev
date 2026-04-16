const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
const { verifyToken } = require('../middleware/auth'); // Pastikan user sudah login

// Endpoint: GET /api/history
router.get('/', verifyToken, getUserHistory);

module.exports = router;