const db = require('../config/database');
const bcrypt = require('bcrypt');

const ensureUserManagementColumns = async () => {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM users LIKE 'is_blocked'");

    if (rows.length === 0) {
      await db.query(`
        ALTER TABLE users
        ADD COLUMN is_blocked TINYINT(1) NOT NULL DEFAULT 0
      `);
    }
  } catch (error) {
    console.warn('ensureUserManagementColumns warning:', error.message);
  }
};

void ensureUserManagementColumns();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==============================
// ADMIN HISTORY
// ==============================
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

    res.status(500).json({
      message: 'Gagal mengambil history admin.',
    });
  }
};

// ==============================
// GET USERS
// ==============================
const getAdminUsers = async (req, res) => {
  try {
    await ensureUserManagementColumns();

    const [rows] = await db.query(`
      SELECT
        id,
        full_name,
        email,
        role,
        avatar_url,
        created_at,
        is_blocked
      FROM users
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.error('getAdminUsers error:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengguna.',
    });
  }
};

// ==============================
// CREATE ADMIN
// ==============================
const createAdminUser = async (req, res) => {

  const full_name = req.body.full_name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nama, email, dan password wajib diisi.',
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format email tidak valid.',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password minimal 8 karakter.',
    });
  }

  try {

    await ensureUserManagementColumns();

    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users
      (full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      `,
      [
        full_name,
        email,
        hashedPassword,
        'admin',
      ]
    );

    const [rows] = await db.query(
      `
      SELECT
        id,
        full_name,
        email,
        role,
        avatar_url,
        created_at,
        is_blocked
      FROM users
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Admin berhasil ditambahkan.',
      data: rows[0],
    });

  } catch (error) {

    console.error('createAdminUser error:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan admin.',
    });
  }
};

// ==============================
// UPDATE ROLE
// ==============================
const updateUserRole = async (req, res) => {

  const { id } = req.params;
  const { role } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID tidak valid.',
    });
  }

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role tidak valid.',
    });
  }

  try {

    await ensureUserManagementColumns();

    const [result] = await db.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.',
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        full_name,
        email,
        role,
        avatar_url,
        created_at,
        is_blocked
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Role berhasil diperbarui.',
      data: rows[0],
    });

  } catch (error) {

    console.error('updateUserRole error:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui role.',
    });
  }
};

// ==============================
// BLOCK / UNBLOCK USER
// ==============================
const toggleUserBlock = async (req, res) => {

  const { id } = req.params;
  const { is_blocked } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID tidak valid.',
    });
  }

  try {

    await ensureUserManagementColumns();

    const [rows] = await db.query(
      'SELECT id, is_blocked FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.',
      });
    }

    const nextBlocked =
      is_blocked !== undefined
        ? Boolean(Number(is_blocked))
        : rows[0].is_blocked !== 1;

    const [result] = await db.query(
      'UPDATE users SET is_blocked = ? WHERE id = ?',
      [
        nextBlocked ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gagal mengubah status blokir.',
      });
    }

    res.status(200).json({
      success: true,
      message: nextBlocked
        ? 'User berhasil diblokir.'
        : 'Blokir user dibuka.',
      data: {
        id,
        is_blocked: nextBlocked,
      },
    });

  } catch (error) {

    console.error('toggleUserBlock error:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengubah status blokir.',
    });
  }
};

module.exports = {
  getAllHistoryForAdmin,
  getAdminUsers,
  createAdminUser,
  updateUserRole,
  toggleUserBlock,
};