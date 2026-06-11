const db = require('../config/database');

// ==========================================
// FUNGSI UNTUK USER (FRONTEND PUBLIK)
// ==========================================

const normalizePaymentMethod = (method) => {
  const mapping = {
    'Transfer Bank': 'transfer',
    'Bank Transfer': 'transfer',
    'transfer': 'transfer',
    'Cash on Delivery': 'cash',
    'COD': 'cash',
    'cash': 'cash',
    'E-Wallet': 'qris',
    'qris': 'qris'
  };
  return mapping[method] || method;
};

const processBooking = async (req, res) => {
  try {
    const { user_id, vehicle_id, start_date, end_date, payment_method } = req.body;

    if (!user_id || !vehicle_id || !start_date || !end_date || !payment_method) {
      return res.status(400).json({ success: false, message: "Validasi Gagal: Semua data wajib diisi!" });
    }

    const normalizedMethod = normalizePaymentMethod(payment_method);
    const validMethods = ['cash', 'transfer', 'qris'];

    if (!validMethods.includes(normalizedMethod)) {
      return res.status(400).json({ success: false, message: "Metode pembayaran tidak valid." });
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const total_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 

    let pricePerDay = 500000; 
    try {
        const [vehicleRows] = await db.query('SELECT price FROM vehicles WHERE id = ?', [vehicle_id]);
        if (vehicleRows.length > 0 && vehicleRows[0].price) {
            pricePerDay = vehicleRows[0].price;
        }
    } catch (err) {}
    
    const total_price = total_days * pricePerDay;

    const [bookingResult] = await db.query(
      `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_days, total_price, booking_status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id, vehicle_id, start_date, end_date, total_days, total_price]
    );

    const newBookingId = bookingResult.insertId;

    await db.query(
      `INSERT INTO payments (booking_id, payment_method, amount, payment_status) 
       VALUES (?, ?, ?, 'pending')`,
      [newBookingId, normalizedMethod, total_price]
    );

    return res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat!",
      data: { booking_id: newBookingId, total_days, total_price }
    });

  } catch (error) {
    console.error('Error processBooking:', error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat menyimpan pesanan." });
  }
};


// ==========================================
// FUNGSI UNTUK ADMIN (DASHBOARD)
// ==========================================

// [READ] Ambil semua pesanan dengan detail lengkap (JOIN)
const getAllBookings = async (req, res) => {
    try {
        const query = `
            SELECT 
                b.id, b.start_date, b.end_date, b.total_days, b.total_price, b.booking_status, b.created_at,
                u.full_name AS user_name, u.email AS user_email,
                v.brand AS vehicle_brand, v.model AS vehicle_model,
                p.payment_method, p.payment_status
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            LEFT JOIN payments p ON b.id = p.booking_id
            ORDER BY b.created_at DESC
        `;
        const [bookings] = await db.query(query);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error getAllBookings:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan' });
    }
};

// [UPDATE] Ubah status pesanan (misal: pending -> active -> completed)
const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { booking_status, payment_status } = req.body;

    try {
        const [existing] = await db.query('SELECT id FROM bookings WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        // Update status booking
        if (booking_status) {
            await db.query('UPDATE bookings SET booking_status = ? WHERE id = ?', [booking_status, id]);
        }

        // Jika admin juga mengubah status pembayaran, update tabel payments
        if (payment_status) {
            await db.query('UPDATE payments SET payment_status = ? WHERE booking_id = ?', [payment_status, id]);
        }

        res.status(200).json({ success: true, message: 'Status pesanan berhasil diperbarui' });
    } catch (error) {
        console.error('Error updateBookingStatus:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan' });
    }
};

// [DELETE] Hapus pesanan (Beserta data pembayarannya)
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Hapus data di tabel payments terlebih dahulu (karena berelasi dengan booking_id)
        await db.query('DELETE FROM payments WHERE booking_id = ?', [id]);
        
        // Baru kemudian hapus data di tabel bookings
        const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus secara permanen' });
    } catch (error) {
        console.error('Error deleteBooking:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus pesanan' });
    }
};

module.exports = { 
    processBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking
};