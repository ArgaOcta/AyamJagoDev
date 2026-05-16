const db = require('../config/database');

const getUserProfile = async (req, res) => {
//  keamanan tambahan jika authMiddleware gagal menjalankan ilangin aja "//" agar logic jalan! kalau bisa gk usahh
    //if (!req.user) {
      //  return res.status(401).json({ message: "Unauthorized" });      
    //}
    const userId = req.user.id; // user gak bisa akses data orang lain
    try {
        // Mengambil data user berdasarkan ID
        const [user] = await db.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?', [userId]);
        
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        // Mengambil riwayat booking user (sesuai target ERD)
        const [bookings] = await db.query(`
            SELECT b.id, v.brand, v.model, b.start_date, b.end_date, b.total_price, b.booking_status 
            FROM bookings b 
            JOIN vehicles v ON b.vehicle_id = v.id 
            WHERE b.user_id = ? 
            ORDER BY b.created_at DESC`, [userId]);

        res.status(200).json({ 
            success: true, 
            data: { 
                profile: user[0], 
                history: bookings 
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error server" });
    }
};

module.exports = { getUserProfile };