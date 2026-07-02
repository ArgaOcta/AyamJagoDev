import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/api';
import { CheckCircle, XCircle, Trash2, Clock, CarFront, User } from 'lucide-react';
import styles from './Booking.module.css'; // <-- Mengimpor CSS Module

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/bookings/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data || response.data || [];
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, bookingStatus, paymentStatus) => {
    const actionText = bookingStatus === 'active' ? 'menyetujui' : 'membatalkan';
    if (window.confirm(`Yakin ingin ${actionText} pesanan ini?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_BASE_URL}/api/bookings/${id}/status`, 
          { booking_status: bookingStatus, payment_status: paymentStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        alert(`Pesanan berhasil diubah menjadi ${bookingStatus.toUpperCase()}!`);
        fetchBookings(); 
      } catch (error) {
        console.error("Error updating status:", error);
        alert('Gagal memperbarui status pesanan.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus permanen riwayat pesanan ini?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert('Data pesanan berhasil dihapus.');
        fetchBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert('Gagal menghapus pesanan.');
      }
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getBadgeClass = (status) => {
    switch(status) {
      case 'pending': return styles.badgePending;
      case 'active': return styles.badgeActive;
      case 'completed': return styles.badgeCompleted;
      case 'cancelled': return styles.badgeCancelled;
      default: return '';
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manajemen Pesanan</h1>
        <p className={styles.subtitle}>Pantau, setujui, dan kelola seluruh jadwal penyewaan kendaraan.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tgl. Dibuat</th>
              <th>Pelanggan</th>
              <th>Armada & Jadwal</th>
              <th>Total Tagihan</th>
              <th>Status Sewa</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data pesanan...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada transaksi penyewaan.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{formatDate(booking.created_at)}</td>
                  
                  <td>
                    <div className={styles.primaryText}>{booking.user_name}</div>
                    <div className={styles.secondaryText}>{booking.user_email}</div>
                  </td>
                  
                  <td>
                    <div className={styles.primaryText}>
                      {booking.vehicle_brand} {booking.vehicle_model}
                      {booking.with_driver ? <span className={styles.driverBadge}>+Driver</span> : ''}
                    </div>
                    <div className={styles.secondaryText}>
                      <Clock size={12} /> {formatDate(booking.start_date)} — {formatDate(booking.end_date)} ({booking.total_days} Hari)
                    </div>
                  </td>
                  
                  <td>
                    <div className={styles.primaryText}>{formatPrice(booking.total_price)}</div>
                    <div className={styles.secondaryText} style={{ textTransform: 'uppercase' }}>
                      Via {booking.payment_method}
                    </div>
                  </td>
                  
                  <td>
                    <span className={`${styles.badge} ${getBadgeClass(booking.booking_status)}`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  
                  <td>
                    <div className={styles.actionGroup}>
                      {booking.booking_status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'active', 'success')}
                            title="Setujui Pesanan"
                            className={`${styles.btnAction} ${styles.btnApprove}`}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled', 'failed')}
                            title="Tolak Pesanan"
                            className={`${styles.btnAction} ${styles.btnReject}`}
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(booking.id)} 
                        title="Hapus Permanen"
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}