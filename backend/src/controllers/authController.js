const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login berhasil',
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const register = async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [full_name, email, hashedPassword, 'user']
        );

        res.json({ message: 'Register berhasil' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, register };