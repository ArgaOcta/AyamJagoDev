const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
<<<<<<< HEAD
const { verifyToken } = require('../middlewares/authMiddleware'); 
=======
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getUserHistory);

module.exports = router;