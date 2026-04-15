const db = require('../config/database');

const getAllVehicles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehicles');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error mengambil data kendaraan:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
};

module.exports = { getAllVehicles };