const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input kosong
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Pembuatan Token
    const token = jwt.sign(
      {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set httpOnly cookie for safer storage in browsers (opsional)
    try {
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
      });
    } catch (e) {
      // ignore cookie set failures in some environments
    }

    // Kembalikan token ke frontend
    res.json({ 
      message: 'Login berhasil', 
      token: token,
      data: {
          user: {
              id: user.id,
              role: user.role,
              full_name: user.full_name
          }
      }
    });
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


const register = async (req, res) => {
  const { full_name, email, password } = req.body;

  // Validasi Dasar
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }

  // Validasi Format Email
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format email tidak valid' });
  }

  // Validasi Panjang Password
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password harus minimal 8 karakter' });
  }

  try {
    // Cek duplikasi email
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // Proses Enkripsi dan Simpan
    const hashedPassword = await bcrypt.hash(password, 10);
    const [insertResult] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, 'user'] // role default adalah 'user'
    );

    const userId = insertResult.insertId;
    const [newUserRows] = await db.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (newUserRows.length === 0) {
      return res.status(500).json({ message: 'Gagal membuat akun. Silakan coba lagi.' });
    }

    const newUser = newUserRows[0];
    
    // Langsung buat token agar user login otomatis setelah register
    const token = jwt.sign(
      {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
        message: 'Register berhasil', 
        token: token,
        data: { user: newUser }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    console.error('Auth register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { login, register };