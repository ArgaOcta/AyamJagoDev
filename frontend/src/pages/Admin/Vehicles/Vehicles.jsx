import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, X, RefreshCw, CarFront } from 'lucide-react';
import { API_BASE_URL } from '../../../utils/api';
import styles from '../Vehicles/Vehicles.module.css';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
  brand: '', 
  model: '', 
  license_plate: '', 
  category: 'mobil', 
  price_per_day: '', 
  status: 'tersedia', 
  image_url: '',
  description: '',
  transmission: 'manual',    
  seat_capacity: 5,          
  fuel_type: 'bensin',       
  luggage_capacity: 2,       
  features: ''               
});
  const [imageFile, setImageFile] = useState(null);

  // [READ] Ambil semua data kendaraan
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehicles`);
      setVehicles(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Gagal memuat data kendaraan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
  setFormData({ 
    brand: '', model: '', license_plate: '', category: 'mobil', price_per_day: '', 
    status: 'tersedia', image_url: '', description: '', 
    transmission: 'manual', seat_capacity: 5, fuel_type: 'bensin', luggage_capacity: 2, features: '' 
  });
  setImageFile(null);
  setIsEditing(false);
  setShowForm(true);
};

  const handleEditClick = (vehicle) => {
  setFormData({
    brand: vehicle.brand, 
    model: vehicle.model, 
    license_plate: vehicle.license_plate,
    category: vehicle.category, 
    price_per_day: vehicle.price_per_day, 
    status: vehicle.status, 
    image_url: vehicle.image_url || '',
    description: vehicle.description || '',
    transmission: vehicle.transmission || 'manual',
    seat_capacity: vehicle.seat_capacity || 5,
    fuel_type: vehicle.fuel_type || 'bensin',
    luggage_capacity: vehicle.luggage_capacity || 2,
    features: vehicle.features || ''
  });
  setEditId(vehicle.id);
  setImageFile(null);
  setIsEditing(true);
  setShowForm(true);
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    
    const dataToSend = new FormData();
    dataToSend.append('brand', formData.brand);
    dataToSend.append('model', formData.model);
    dataToSend.append('license_plate', formData.license_plate);
    dataToSend.append('category', formData.category);
    dataToSend.append('price_per_day', formData.price_per_day);
    dataToSend.append('status', formData.status);
    dataToSend.append('description', formData.description);
    dataToSend.append('transmission', formData.transmission);
    dataToSend.append('seat_capacity', formData.seat_capacity);
    dataToSend.append('fuel_type', formData.fuel_type);        
    dataToSend.append('luggage_capacity', formData.luggage_capacity);
    dataToSend.append('features', formData.features);
    
    if (isEditing) {
      dataToSend.append('existing_image', formData.image_url);
    }

    if (imageFile) {
      dataToSend.append('image', imageFile);
    }

    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };

    if (isEditing) {
      await axios.put(`${API_BASE_URL}/api/vehicles/${editId}`, dataToSend, { headers });
      alert('Data kendaraan berhasil diperbarui!');
    } else {
      await axios.post(`${API_BASE_URL}/api/vehicles`, dataToSend, { headers });
      alert('Kendaraan baru berhasil ditambahkan!');
    }
    
    setShowForm(false);
    fetchVehicles();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menyimpan data kendaraan.');
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kendaraan ini? Data tidak dapat dikembalikan.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus kendaraan (mungkin sedang disewa).');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Kendaraan</h1>
          <p className={styles.subtitle}>Kelola armada kendaraan AyamJago.dev</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchVehicles} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            <RefreshCw size={18} /> Refresh
          </button>
          <button onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            <Plus size={18} /> Tambah Kendaraan
          </button>
        </div>
      </div>

      {/* FORM MODAL (Tampil jika showForm = true) */}
      {showForm && (
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem' }}>{isEditing ? 'Edit Data Kendaraan' : 'Tambah Kendaraan Baru'}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} placeholder="Contoh: Toyota" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Model</label>
              <input type="text" name="model" value={formData.model} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} placeholder="Contoh: Avanza" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Plat Nomor</label>
              <input type="text" name="license_plate" value={formData.license_plate} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} placeholder="Contoh: B 1234 XYZ" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Kategori</label>
              <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff' }}>
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Harga per Hari (Rp)</label>
              <input type="number" name="price_per_day" value={formData.price_per_day} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} placeholder="Contoh: 300000" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff' }}>
                <option value="tersedia">Tersedia</option>
                <option value="disewa">Disewa</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Upload Gambar Kendaraan (Opsional)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff' }} 
              />
              {/* Tampilkan preview kecil jika sedang Edit dan sudah ada gambar */}
              {isEditing && formData.image_url && !imageFile && (
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                  Gambar saat ini sudah tersimpan. Biarkan kosong jika tidak ingin mengubahnya.
                </p>
              )}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Deskripsi Tambahan</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tulis detail kendaraan di sini..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }} />
            </div>
            
            <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan Kendaraan'}
            </button>
          </form>
        </div>
      )}

      {/* TABEL DATA */}
      <div className={styles.content}>
        {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '15px', borderRadius: '6px', width: '100%' }}>{error}</div>}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', width: '100%' }}>
            <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 10px' }} />
            <p>Memuat data armada...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', width: '100%' }}>
            <CarFront size={48} style={{ margin: '0 auto 10px', color: '#9ca3af' }} />
            <p>Belum ada armada. Silakan tambah kendaraan baru.</p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Plat Nomor</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Kendaraan</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Kategori</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Harga / Hari</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Status</th>
                  <th style={{ padding: '12px', color: '#4b5563', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#374151' }}>{v.license_plate}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{v.brand} {v.model}</div>
                    </td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{v.category}</td>
                    <td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>
                      Rp {Number(v.price_per_day).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        backgroundColor: v.status === 'tersedia' ? '#dcfce7' : v.status === 'disewa' ? '#fef3c7' : '#fee2e2', 
                        color: v.status === 'tersedia' ? '#166534' : v.status === 'disewa' ? '#92400e' : '#991b1b',
                        textTransform: 'capitalize'
                      }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => handleEditClick(v)} style={{ padding: '6px', backgroundColor: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '4px', cursor: 'pointer' }} title="Edit Data">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(v.id)} style={{ padding: '6px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }} title="Hapus Data">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}