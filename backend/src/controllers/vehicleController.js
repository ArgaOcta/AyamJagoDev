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

const getVehicleById = async (req, res) => {
    const vehicleId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ?', [vehicleId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });
        }
        
        res.status(200).json(rows[0]); // Langsung kirim objek data mobilnya
    } catch (error) {
        console.error("Error getVehicleById:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = { 
    getVehicleById, 
    getAllVehicles 
};