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
  const { brand, model, category, year, price, status, image_url } = req.body;

  if (!brand || !model || !price) {
    return res.status(400).json({ success: false, message: 'Brand, model, dan harga wajib diisi!' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO vehicles (brand, model, category, year, price, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [brand, model, category || 'Mobil', year || null, price, status || 'available', image_url || null]
    );

    res.status(201).json({
      success: true,
      message: 'Kendaraan berhasil ditambahkan',
      data: { id: result.insertId, brand, model }
    });
  } catch (error) {
    console.error('Error createVehicle:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menambahkan kendaraan' });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { brand, model, category, year, price, status, image_url } = req.body;

  try {
    // Cek apakah data ada
    const [existing] = await db.query('SELECT id FROM vehicles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan' });
    }

    await db.query(
      'UPDATE vehicles SET brand = ?, model = ?, category = ?, year = ?, price = ?, status = ?, image_url = ? WHERE id = ?',
      [brand, model, category, year, price, status, image_url, id]
    );

    res.status(200).json({ success: true, message: 'Data kendaraan berhasil diperbarui' });
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