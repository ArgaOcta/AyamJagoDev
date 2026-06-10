import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, CalendarCheck } from 'lucide-react';
import { API_BASE_URL } from '../../../utils/api';
import styles from '../Shared/AdminPage.module.css';

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.data);
      setError('');
    } catch (err) {
      console.error('Gagal mengambil data pesanan:', err);
      setError('Gagal memuat data pesanan. Pastikan server backend menyala.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, field, newValue) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { [field]: newValue };

      await axios.put(`${API_BASE_URL}/api/bookings/${id}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, [field]: newValue } : booking
      ));
      
      alert('Status berhasil diperbarui!');
    } catch (err) {
      console.error('Gagal update status:', err);
      alert('Gagal memperbarui status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesanan ini secara permanen?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(bookings.filter(booking => booking.id !== id));
      alert('Pesanan berhasil dihapus.');
    } catch (err) {
      console.error('Gagal menghapus pesanan:', err);
      alert('Gagal menghapus pesanan.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={styles.pageContainer}>
      {/* HEADER SECTION - Sesuai dengan template-mu */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.subtitle}>Kelola reservasi dan jadwal pelanggan.</p>
        </div>
        <button 
          className="btn btn-solid" 
          onClick={fetchBookings}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={18} /> Segarkan Data
        </button>
      </div>

      {/* CONTENT SECTION - Menampilkan Error / Loading / Tabel */}
      <div className={styles.content}>
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '15px', borderRadius: '6px', width: '100%' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', width: '100%' }}>
            <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 10px' }} />
            <p>Memuat data pesanan...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', width: '100%' }}>
            <CalendarCheck size={48} style={{ margin: '0 auto 10px', color: '#9ca3af' }} />
            <p>Belum ada data reservasi saat ini.</p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '12px', color: '#4b5563' }}>ID</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Penyewa</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Kendaraan</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Tanggal Sewa</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Total Harga</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Pembayaran</th>
                  <th style={{ padding: '12px', color: '#4b5563' }}>Status</th>
                  <th style={{ padding: '12px', color: '#4b5563', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#374151' }}>#{booking.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{booking.user_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{booking.user_email}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {booking.vehicle_brand} {booking.vehicle_model}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ color: '#1f2937' }}>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>({booking.total_days} hari)</div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#059669' }}>
                      Rp {Number(booking.total_price).toLocaleString('id-ID')}
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal', textTransform: 'capitalize' }}>
                        {booking.payment_method}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={booking.payment_status} 
                        onChange={(e) => handleStatusUpdate(booking.id, 'payment_status', e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', cursor: 'pointer', backgroundColor: booking.payment_status === 'success' ? '#dcfce7' : '#fef3c7' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={booking.booking_status} 
                        onChange={(e) => handleStatusUpdate(booking.id, 'booking_status', e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', cursor: 'pointer', backgroundColor: '#f3f4f6' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        style={{ padding: '6px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        title="Hapus Pesanan"
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      >
                        <Trash2 size={16} />
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

export default Bookings;