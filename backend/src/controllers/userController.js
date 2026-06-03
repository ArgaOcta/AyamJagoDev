const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [user] = await db.query('SELECT id, full_name, email, role, avatar_url, created_at FROM users WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const [bookings] = await db.query(
      'SELECT b.id, v.brand, v.model, b.start_date, b.end_date, b.total_price, b.booking_status ' +
      'FROM bookings b ' +
      'JOIN vehicles v ON b.vehicle_id = v.id ' +
      'WHERE b.user_id = ? ' +
      'ORDER BY b.created_at DESC',
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        profile: user[0],
        history: bookings,
      },
    });
  } catch (error) {
    console.error('Error getUserProfile:', error.message);
    res.status(500).json({ success: false, message: 'Error server' });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ success: false, message: 'Nama dan email wajib diisi.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah digunakan oleh akun lain.' });
    }

    await db.query('UPDATE users SET full_name = ?, email = ? WHERE id = ?', [full_name, email, userId]);

    const [user] = await db.query('SELECT id, full_name, email, role, avatar_url, created_at FROM users WHERE id = ?', [userId]);
    const updatedUser = user[0];
    const token = jwt.sign(
      {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url,
        created_at: updatedUser.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ success: true, token, data: { profile: updatedUser } });
  } catch (error) {
    console.error('Error updateUserProfile:', error.message);
    res.status(500).json({ success: false, message: 'Error server saat memperbarui profil.' });
  }
};

const changeUserPassword = async (req, res) => {
  const userId = req.user.id;
  const { current_password, new_password, confirm_password } = req.body;

  if (!current_password || !new_password || !confirm_password) {
    return res.status(400).json({ success: false, message: 'Semua field password wajib diisi.' });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ success: false, message: 'Password baru dan konfirmasi tidak cocok.' });
  }

  if (new_password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password baru harus minimal 8 karakter.' });
  }

  try {
    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password saat ini salah.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({ success: true, message: 'Password berhasil diubah.' });
  } catch (error) {
    console.error('Error changeUserPassword:', error.message);
    res.status(500).json({ success: false, message: 'Error server saat mengubah password.' });
  }
};

const deleteUserAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ success: true, message: 'Akun berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleteUserAccount:', error.message);
    res.status(500).json({ success: false, message: 'Error server saat menghapus akun.' });
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.user.id;
  const { avatar_data } = req.body;

  if (!avatar_data) {
    return res.status(400).json({ success: false, message: 'Data avatar tidak disediakan.' });
  }

  try {
    // Store the base64 encoded image data directly
    await db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatar_data, userId]);

    const [user] = await db.query('SELECT id, full_name, email, role, avatar_url, created_at FROM users WHERE id = ?', [userId]);
    const updatedUser = user[0];
    
    const token = jwt.sign(
      {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url,
        created_at: updatedUser.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ success: true, token, data: { profile: updatedUser } });
  } catch (error) {
    console.error('Error updateAvatar:', error.message);
    res.status(500).json({ success: false, message: 'Error server saat memperbarui avatar.' });
  }
};

module.exports = { getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount, updateAvatar };