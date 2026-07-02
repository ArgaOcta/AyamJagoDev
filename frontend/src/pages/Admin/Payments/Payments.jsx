import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/api';
import { Wallet, CheckCircle, CreditCard, Banknote } from 'lucide-react';
import styles from './Payments.module.css';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data menggunakan rute admin bookings karena datanya sudah di-JOIN
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/bookings/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data || response.data || [];
      // Kita bisa memfilter hanya menampilkan pesanan yang belum dibatalkan
      const activePayments = data.filter(item => item.booking_status !== 'cancelled');
      setPayments(activePayments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fungsi Verifikasi Pembayaran Saja
  const handleVerifyPayment = async (id) => {
    if (window.confirm('Verifikasi bahwa dana telah diterima atau dibayar cash?')) {
      try {
        const token = localStorage.getItem('token');
        // Kita hanya mengupdate payment_status menjadi 'success'
        await axios.put(`${API_BASE_URL}/api/bookings/${id}/status`, 
          { booking_status: 'active', payment_status: 'success' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        alert('Pembayaran berhasil diverifikasi!');
        fetchPayments(); 
      } catch (error) {
        console.error("Error verifying payment:", error);
        alert('Gagal memverifikasi pembayaran.');
      }
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return styles.badgePending;
      case 'success': return styles.badgeSuccess;
      case 'failed': return styles.badgeFailed;
      default: return '';
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'transfer': return <CreditCard size={14} />;
      case 'qris': return <Wallet size={14} />;
      case 'cash': return <Banknote size={14} />;
      default: return <Wallet size={14} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Verifikasi Pembayaran</h1>
        <p className={styles.subtitle}>Pantau tagihan masuk, cek mutasi rekening, dan verifikasi status pembayaran pelanggan.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID & Waktu</th>
              <th>Pelanggan</th>
              <th>Metode Bayar</th>
              <th>Total Tagihan</th>
              <th>Status Pembayaran</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data tagihan...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data pembayaran.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className={styles.primaryText}>#TRX-{payment.id}</div>
                    <div className={styles.secondaryText}>{formatDate(payment.created_at)}</div>
                  </td>
                  
                  <td>
                    <div className={styles.primaryText}>{payment.user_name}</div>
                    <div className={styles.secondaryText}>{payment.vehicle_brand} {payment.vehicle_model}</div>
                  </td>
                  
                  <td>
                    <div className={styles.methodBadge}>
                      {getMethodIcon(payment.payment_method)}
                      {payment.payment_method}
                    </div>
                  </td>
                  
                  <td>
                    <div className={styles.primaryText}>{formatPrice(payment.total_price)}</div>
                    {payment.with_driver && <div className={styles.secondaryText}>*Termasuk biaya driver</div>}
                  </td>
                  
                  <td>
                    <span className={`${styles.badge} ${getStatusBadge(payment.payment_status)}`}>
                      {payment.payment_status || 'pending'}
                    </span>
                  </td>
                  
                  <td>
                    <div className={styles.actionGroup}>
                      {payment.payment_status === 'pending' ? (
                        <button 
                          onClick={() => handleVerifyPayment(payment.id)}
                          title="Verifikasi Dana Masuk"
                          className={`${styles.btnAction} ${styles.btnVerify}`}
                        >
                          <CheckCircle size={15} />
                          Verifikasi
                        </button>
                      ) : (
                        <span className={styles.secondaryText} style={{ margin: 0 }}>Selesai</span>
                      )}
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