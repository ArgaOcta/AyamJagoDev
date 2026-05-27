const db = require('../config/database');

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

