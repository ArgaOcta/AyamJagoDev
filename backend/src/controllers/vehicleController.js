const db = require('../config/database');

const getAllVehicles = async (req, res) => {
  try {
    const [vehicles] = await db.query('SELECT * FROM vehicles ORDER BY id DESC');
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error getAllVehicles:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data kendaraan' });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [vehicle] = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (vehicle.length === 0) {
      return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: vehicle[0] });
  } catch (error) {
    console.error('Error getVehicleById:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data detail kendaraan' });
  }
};

const createVehicle = async (req, res) => {
  const { 
    brand, model, license_plate, category, price_per_day, 
    status, description, transmission, seat_capacity, 
    fuel_type, luggage_capacity, features 
  } = req.body;

  if (!brand || !model || !license_plate || !price_per_day) {
    return res.status(400).json({ success: false, message: 'Brand, model, plat nomor, dan harga wajib diisi!' });
  }

  try {
    const image_url = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO vehicles (
        brand, model, license_plate, category, price_per_day, 
        status, image_url, description, transmission, seat_capacity, 
        fuel_type, luggage_capacity, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        brand, model, license_plate, category || 'mobil', price_per_day, 
        status || 'tersedia', image_url, description || null, 
        transmission || 'manual', seat_capacity || 5, 
        fuel_type || 'bensin', luggage_capacity || 2, 
        features || null
      ]
    );

    res.status(201).json({ success: true, message: 'Kendaraan berhasil ditambahkan dengan spesifikasi lengkap!' });
  } catch (error) {
    console.error('Error createVehicle:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menambahkan kendaraan' });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { 
    brand, model, license_plate, category, price_per_day, 
    status, description, existing_image, transmission, 
    seat_capacity, fuel_type, luggage_capacity, features 
  } = req.body;

  try {
    const [existing] = await db.query('SELECT id FROM vehicles WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan' });

    const image_url = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : existing_image;

    await db.query(
      `UPDATE vehicles SET 
        brand = ?, model = ?, license_plate = ?, category = ?, price_per_day = ?, 
        status = ?, image_url = ?, description = ?, transmission = ?, 
        seat_capacity = ?, fuel_type = ?, luggage_capacity = ?, features = ? 
      WHERE id = ?`,
      [
        brand, model, license_plate, category, price_per_day, 
        status, image_url, description, transmission, 
        seat_capacity, fuel_type, luggage_capacity, features, id
      ]
    );

    res.status(200).json({ success: true, message: 'Data dan spesifikasi kendaraan berhasil diperbarui!' });
  } catch (error) {
    console.error('Error updateVehicle:', error.message);
    res.status(500).json({ success: false, message: 'Gagal memperbarui kendaraan' });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Kendaraan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleteVehicle:', error.message);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ success: false, message: 'Gagal dihapus: Kendaraan ini memiliki riwayat pesanan.' });
    }
    res.status(500).json({ success: false, message: 'Gagal menghapus kendaraan' });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};