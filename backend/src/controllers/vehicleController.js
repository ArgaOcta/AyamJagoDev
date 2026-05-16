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
        
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error getVehicleById:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const deleteVehicle = async (req, res) => {
    const vehicleId = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [vehicleId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Kendaraan berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus kendaraan:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat menghapus kendaraan' });
    }
};

module.exports = { 
    getVehicleById, 
    getAllVehicles,
    deleteVehicle
};