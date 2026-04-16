const db = require('../config/db'); // Sesuaikan dengan konfigurasi database kelompok Anda

const getUserHistory = async (req, res) => {
    // user_id biasanya didapat dari middleware auth (tugas Anwar Maulana)
    const userId = req.user.id; 

    const query = `
        SELECT 
            b.id, 
            v.brand, 
            v.model AS vehicle_name, 
            b.start_date, 
            b.end_date, 
            b.total_price, 
            b.booking_status 
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `;

    try {
        const [results] = await db.execute(query, [userId]);
        
        if (results.length === 0) {
            return res.status(200).json({ message: "Belum ada riwayat penyewaan." });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data riwayat." });
    }
};

module.exports = { getUserHistory };