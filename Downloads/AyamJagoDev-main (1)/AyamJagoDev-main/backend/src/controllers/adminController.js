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

// Create a new admin user (only Super Admin should call this via route protection)
const createAdmin = async (req, res) => {
  const { full_name, email, password, username } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'full_name, email, and password are required' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already used' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)', [full_name, email, hashed, 'admin']);

    const [rows] = await db.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('createAdmin error:', error);
    res.status(500).json({ message: 'Gagal membuat admin baru.' });
  }
};

// Change a user's role (Super Admin only)
const changeUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (!['superadmin', 'admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be "superadmin", "admin" or "user".' });
  }

  try {
    const [rows] = await db.query('SELECT id, role FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const previousRole = rows[0].role;
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    // ensure activity log table exists
    await db.query(`CREATE TABLE IF NOT EXISTS admin_activity_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor_id INT NOT NULL,
      target_user_id INT NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

    // record log
    const actorId = req.user?.id || null;
    const details = JSON.stringify({ previousRole, newRole: role });
    await db.query('INSERT INTO admin_activity_logs (actor_id, target_user_id, action, details) VALUES (?, ?, ?, ?)', [actorId, userId, 'change_role', details]);

    res.status(200).json({ success: true, message: 'Role updated.' });
  } catch (error) {
    console.error('changeUserRole error:', error);
    res.status(500).json({ message: 'Gagal mengubah role pengguna.' });
  }
};

// Block or unblock a user (Admin and Super Admin)
const setUserBlocked = async (req, res) => {
  const userId = req.params.id;
  const { blocked } = req.body; // boolean
  const { reason } = req.body || {};

  try {
    // ensure column exists
    const [col] = await db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_blocked'");
    if (col.length === 0) {
      await db.query('ALTER TABLE users ADD COLUMN is_blocked TINYINT(1) DEFAULT 0');
    }

    const [rows] = await db.query('SELECT id, role FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const value = blocked ? 1 : 0;
    await db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [value, userId]);

    // ensure block logs table exists
    await db.query(`CREATE TABLE IF NOT EXISTS user_block_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor_id INT NOT NULL,
      target_user_id INT NOT NULL,
      reason TEXT,
      action VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

    const actorId = req.user?.id || null;
    const action = blocked ? 'block' : 'unblock';
    await db.query('INSERT INTO user_block_logs (actor_id, target_user_id, reason, action) VALUES (?, ?, ?, ?)', [actorId, userId, reason || null, action]);

    res.status(200).json({ success: true, message: blocked ? 'User blocked.' : 'User unblocked.' });
  } catch (error) {
    console.error('setUserBlocked error:', error);
    res.status(500).json({ message: 'Gagal memperbarui status blokir pengguna.' });
  }
};

// Get all users (for admin dashboard)
const getAllUsers = async (req, res) => {
  try {
    // attempt select including is_blocked if exists
    const [cols] = await db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'");
    const hasBlocked = cols.some(c => c.COLUMN_NAME === 'is_blocked');
    const select = hasBlocked ? 'id, full_name, email, role, is_blocked, created_at' : 'id, full_name, email, role, created_at';
    const [rows] = await db.query(`SELECT ${select} FROM users ORDER BY created_at DESC`);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: 'Gagal mendapatkan daftar pengguna.' });
  }
};

module.exports = { getAllHistoryForAdmin, createAdmin, changeUserRole, setUserBlocked, getAllUsers };

