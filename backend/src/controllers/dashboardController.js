const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Hitung Total Kendaraan
    const [vehicles] = await db.query('SELECT COUNT(*) as total FROM vehicles');
    
    // 2. Hitung Active Bookings
    const [activeBookings] = await db.query('SELECT COUNT(*) as total FROM bookings WHERE booking_status = "active"');
    
    // 3. Hitung Total User
    const [users] = await db.query('SELECT COUNT(*) as total FROM users');
    
    // 4. Hitung Total Revenue - JOIN ke tabel payments untuk mendapatkan status pembayaran
    const [revenue] = await db.query(
      'SELECT SUM(b.total_price) as total FROM bookings b ' +
      'JOIN payments p ON b.id = p.booking_id ' + 
      'WHERE p.payment_status = "success"'
    );

    // 5. Ambil 4 Pesanan Terbaru
    const [recentBookings] = await db.query(
      'SELECT b.id, u.full_name as customer_name, v.model as vehicle_model, b.booking_status as status ' +
      'FROM bookings b ' +
      'JOIN users u ON b.user_id = u.id ' +
      'JOIN vehicles v ON b.vehicle_id = v.id ' +
      'ORDER BY b.created_at DESC LIMIT 4'
    );

    res.status(200).json({
      stats: {
        vehicles: vehicles[0].total,
        active: activeBookings[0].total,
        users: users[0].total,
        revenue: revenue[0].total || 0
      },
      recentBookings: recentBookings
    });
  } catch (error) {
    console.error('Error Dashboard Stats:', error);
    res.status(500).json({ message: "Gagal memuat statistik dashboard" });
  }
};