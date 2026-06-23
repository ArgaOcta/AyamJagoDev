const db = require('../config/database');
const bcrypt = require('bcrypt');

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

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, avatar_url, created_at, is_blocked FROM users ORDER BY created_at DESC'
    );

    const users = rows.map((user) => ({
      ...user,
      is_blocked: Boolean(user.is_blocked),
    }));

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar pengguna.' });
  }
};

const createUser = async (req, res) => {
  const { full_name, email, password, role = 'user', is_blocked = false } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
  }

  const normalizedRole = role === 'admin' ? 'admin' : 'user';

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, role, is_blocked) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, normalizedRole, is_blocked ? 1 : 0]
    );

    const [rows] = await db.query(
      'SELECT id, full_name, email, role, avatar_url, created_at, is_blocked FROM users WHERE id = ?',
      [result.insertId]
    );

    const newUser = rows[0];
    res.status(201).json({ success: true, data: { ...newUser, is_blocked: Boolean(newUser.is_blocked) } });
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat pengguna baru.' });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role tidak valid. Pilih admin atau user.' });
  }

  try {
    const [result] = await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }
    res.status(200).json({ success: true, message: 'Role pengguna berhasil diperbarui.' });
  } catch (error) {
    console.error('updateUserRole error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui role pengguna.' });
  }
};

const setUserBlockStatus = async (req, res) => {
  const { id } = req.params;
  const { blocked } = req.body;

  if (typeof blocked !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Nilai blocked harus berupa boolean.' });
  }

  try {
    const [result] = await db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [blocked ? 1 : 0, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }
    res.status(200).json({ success: true, message: `Pengguna berhasil ${blocked ? 'diblockir' : 'diaktifkan kembali'}.` });
  } catch (error) {
    console.error('setUserBlockStatus error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status blokir pengguna.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }
    res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.' });
  }
};

module.exports = {
  getAllHistoryForAdmin,
  getAllUsers,
  createUser,
  updateUserRole,
  setUserBlockStatus,
  deleteUser,
};

