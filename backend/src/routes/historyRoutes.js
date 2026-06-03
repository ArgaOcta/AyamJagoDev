const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
const { verifyToken } = require('../middlewares/authMiddleware'); 
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getUserHistory);

module.exports = router;