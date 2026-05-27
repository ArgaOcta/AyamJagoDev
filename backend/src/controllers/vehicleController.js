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

const createVehicle = async (req, res) => {
    const { brand, model, license_plate, category, price_per_day, status, image_url, description } = req.body;

    if (!brand || !model || !license_plate || !category || !price_per_day || !status) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO vehicles (brand, model, license_plate, category, price_per_day, status, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [brand, model, license_plate, category, price_per_day, status, image_url || '', description || '']
        );

        const [createdRows] = await db.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: createdRows[0] });
    } catch (error) {
        console.error('Error createVehicle:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat kendaraan.' });
    }
};

const deleteVehicle = async (req, res) => {
    const vehicleId = req.params.id;

    try {
        const [rows] = await db.query('SELECT id FROM vehicles WHERE id = ?', [vehicleId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan.' });
        }

        await db.query('DELETE FROM vehicles WHERE id = ?', [vehicleId]);
        res.status(200).json({ success: true, message: 'Kendaraan berhasil dihapus.' });
    } catch (error) {
        console.error('Error deleteVehicle:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus kendaraan.' });
    }
};

module.exports = { 
    getVehicleById, 
    getAllVehicles,
    createVehicle,
    deleteVehicle
};