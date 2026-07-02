  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { API_BASE_URL, getAuthHeaders, isAuthenticated } from '../utils/api';
  // Opsional: Import ikon jika kamu pakai lucide-react (seperti di halaman lain)
  // import { Eye, Edit, Trash2, X } from 'lucide-react'; 

  const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State untuk Edit
    const [editingBooking, setEditingBooking] = useState(null);
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');

    // State untuk Detail (Invoice)
    const [selectedDetail, setSelectedDetail] = useState(null);

    const navigate = useNavigate();

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/history`, {
          headers: getAuthHeaders(),
        });
        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Gagal memuat riwayat:', error);
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
      fetchHistory();
    }, [navigate]);

    const getStatusStyle = (status) => {
      const styles = {
        completed: { bg: '#dcfce7', color: '#166534' }, // Hijau
        success: { bg: '#dcfce7', color: '#166534' },
        active: { bg: '#dbeafe', color: '#1e40af' }, // Biru
        pending: { bg: '#fef3c7', color: '#92400e' }, // Kuning
        cancelled: { bg: '#fee2e2', color: '#991b1b' }, // Merah
      };
      return styles[status?.toLowerCase()] || { bg: '#f3f4f6', color: '#374151' };
    };

    const handleCancelBooking = async (id) => {
      if (!window.confirm('Apakah Anda yakin ingin membatalkan booking ini?')) return;
      try {
        await axios.patch(`${API_BASE_URL}/api/bookings/cancel/${id}`, {}, {
          headers: getAuthHeaders()
        });
        alert('Booking berhasil dibatalkan');
        fetchHistory();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan booking');
      }
    };

    const handleEditBooking = (booking) => {
      setEditingBooking(booking);
      setEditStartDate(booking.start_date.split('T')[0]);
      setEditEndDate(booking.end_date.split('T')[0]);
    };

    const handleSaveEdit = async () => {
      try {
        await axios.put(`${API_BASE_URL}/api/bookings/update/${editingBooking.id}`, {
          vehicle_id: editingBooking.vehicle_id,
          start_date: editStartDate,
          end_date: editEndDate
        }, {
          headers: getAuthHeaders()
        });
        alert('Booking berhasil diperbarui');
        setEditingBooking(null);
        fetchHistory();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal mengubah booking');
      }
    };

    if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat riwayat perjalanan...</div>;

    return (
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#1f2937', margin: '0 0 8px 0' }}>Riwayat Penyewaan Saya</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Daftar armada yang pernah Anda sewa di AyamJago.dev.</p>
        </div>

        {history.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9fafb', borderRadius: '8px', color: '#6b7280' }}>
            Belum ada riwayat transaksi. Yuk, mulai perjalanan pertamamu!
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px' }}>ID</th>
                  <th style={{ padding: '16px' }}>Kendaraan</th>
                  <th style={{ padding: '16px' }}>Jadwal Sewa</th>
                  <th style={{ padding: '16px' }}>Total Tagihan</th>
                  <th style={{ padding: '16px' }}>Status Bayar</th>
                  <th style={{ padding: '16px' }}>Status Sewa</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => {
                  const bStatus = getStatusStyle(item.booking_status);
                  const pStatus = getStatusStyle(item.payment_status || 'pending');

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#2563eb' }}>#{item.id}</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{item.vehicle_name || 'Armada AyamJago'}</td>
                      <td style={{ padding: '16px', color: '#4b5563' }}>
                        {new Date(item.start_date).toLocaleDateString('id-ID')} - {new Date(item.end_date).toLocaleDateString('id-ID')}
                      </td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#059669' }}>
                        Rp {Number(item.total_price).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: pStatus.bg, color: pStatus.color, textTransform: 'uppercase' }}>
                          {item.payment_status || 'PENDING'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: bStatus.bg, color: bStatus.color, textTransform: 'uppercase' }}>
                          {item.booking_status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          {/* Tombol Detail Selalu Muncul */}
                          <button 
                            onClick={() => setSelectedDetail(item)}
                            style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontWeight: '500' }}
                          >
                            Detail
                          </button>
                          
                          {item.booking_status === 'pending' && (
                            <>
                              <button onClick={() => handleEditBooking(item)} style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', fontWeight: '500' }}>
                                Edit
                              </button>
                              <button onClick={() => handleCancelBooking(item.id)} style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', fontWeight: '500' }}>
                                Batal
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= MODAL DETAIL ================= */}
        {selectedDetail && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, color: '#1f2937' }}>Detail Pesanan #{selectedDetail.id}</h3>
                <button onClick={() => setSelectedDetail(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
              </div>
              
              <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem', color: '#4b5563' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kendaraan:</span> <strong>{selectedDetail.vehicle_name}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tgl Mulai:</span> <strong>{new Date(selectedDetail.start_date).toLocaleDateString('id-ID')}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tgl Selesai:</span> <strong>{new Date(selectedDetail.end_date).toLocaleDateString('id-ID')}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lokasi Pickup:</span> <strong>{selectedDetail.pickup_location || '-'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Opsi Supir:</span> <strong>{selectedDetail.with_driver ? 'Ya (+Biaya)' : 'Tidak (Lepas Kunci)'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Catatan:</span> <strong>{selectedDetail.notes || '-'}</strong></div>
                <hr style={{ border: 'none', borderTop: '1px dashed #d1d5db', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#111827' }}>
                  <span>Total Biaya:</span> <strong>Rp {Number(selectedDetail.total_price).toLocaleString('id-ID')}</strong>
                </div>
              </div>

              <button onClick={() => setSelectedDetail(null)} style={{ width: '100%', marginTop: '24px', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ================= MODAL EDIT (Tetap Sama, dirapikan sedikit style-nya) ================= */}
        {editingBooking && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Ubah Jadwal Sewa</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tanggal Mulai</label>
                <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tanggal Selesai</label>
                <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSaveEdit} style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan</button>
                <button onClick={() => setEditingBooking(null)} style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default HistoryPage;