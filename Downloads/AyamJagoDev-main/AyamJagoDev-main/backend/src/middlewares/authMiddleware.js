const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token tidak ada' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await db.query('SELECT id, role, is_blocked FROM users WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User tidak ditemukan' });
        }

        if (rows[0].is_blocked) {
            return res.status(403).json({ message: 'Akun diblokir' });
        }

        req.user = {
            id: rows[0].id,
            role: rows[0].role,
            is_blocked: Boolean(rows[0].is_blocked),
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};

module.exports = authMiddleware;
