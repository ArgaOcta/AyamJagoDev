const db = require('../config/database');
const bcrypt = require('bcrypt');

// --- USER MANAGEMENT (Super Admin only) ---
const listUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, full_name, username, email, role, is_blocked, created_at FROM users ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('listUsers error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar pengguna.' });
  }
};

const createAdmin = async (req, res) => {
  const { full_name, username, email, password, confirm_password } = req.body;

  if (!full_name || !username || !email || !password || !confirm_password) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ success: false, message: 'Password dan konfirmasi tidak cocok.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password harus minimal 8 karakter.' });
  }

  try {
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length) return res.status(409).json({ success: false, message: 'Email sudah digunakan.' });

    const [existingUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length) return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (full_name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)', [full_name, username, email, hashed, 'admin']);

    const [newRows] = await db.query('SELECT id, full_name, username, email, role, is_blocked, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newRows[0], message: 'Admin berhasil ditambahkan.' });
  } catch (error) {
    console.error('createAdmin error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal membuat admin.' });
  }
};

const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  const allowed = ['user', 'admin'];
  if (!allowed.includes(role)) return res.status(400).json({ success: false, message: 'Role tidak valid.' });

  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    res.status(200).json({ success: true, message: 'Role berhasil diperbarui.' });
  } catch (error) {
    console.error('updateUserRole error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal memperbarui role.' });
  }
};

const setBlockStatus = async (req, res) => {
  const userId = req.params.id;
  const { blocked } = req.body; // boolean

  try {
    await db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [blocked ? 1 : 0, userId]);
    res.status(200).json({ success: true, message: blocked ? 'User diblokir.' : 'User dibuka blokir.' });
  } catch (error) {
    console.error('setBlockStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status blokir.' });
  }
};

// Admin: ambil semua history/booking (join vehicles)
const getAllHistoryForAdmin = async (req, res) => {
  const query = `
    SELECT
      b.id,
      u.full_name AS user_name,
      u.email AS user_email,
      v.brand,
      v.model AS vehicle_name,
      b.start_date,
      b.end_date,
      b.total_price,
      b.booking_status,
      b.created_at
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.created_at DESC
  `;

  try {
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('getAllHistoryForAdmin error:', error);
    res.status(500).json({ message: 'Gagal mengambil history admin.' });
  }
};

module.exports = { getAllHistoryForAdmin };
module.exports = { getAllHistoryForAdmin, listUsers, createAdmin, updateUserRole, setBlockStatus };

