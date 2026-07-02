import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import { CreditCard, Wallet, Banknote, ShieldCheck, Upload } from 'lucide-react';
import styles from './Payment.module.css';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null); 
  
  const bookingData = location.state;

  useEffect(() => {
    if (!bookingData) {
      alert('Data pesanan tidak ditemukan. Silakan mulai proses booking dari awal.');
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null; 

  const formatPrice = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
    }
  };

  const handlePaymentComplete = async () => {
    if (bookingData.payment_method === 'transfer' && !proofFile) {
      alert('Harap unggah bukti transfer Anda terlebih dahulu!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(bookingData).forEach(key => {
        formData.append(key, bookingData[key]);
      });
      
      if (proofFile) {
        formData.append('proof_of_payment', proofFile);
      }
      
      await axios.post(`${API_BASE_URL}/api/bookings`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      alert('Pemesanan dan bukti transfer berhasil dikirim! Admin akan segera memverifikasi.');
      navigate('/history'); 
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Gagal memproses pemesanan.');
    } finally {
      setLoading(false);
    }
  };

  const renderInstructions = () => {
    switch(bookingData.payment_method) {
      case 'transfer':
        const dummyVA = "88000 0812 3456 7890"; 
        return (
          <div className={styles.instructionBox}>
            <h4><CreditCard size={20} /> Transfer Virtual Account (VA)</h4>
            <p>Silakan transfer sebesar <strong>{formatPrice(bookingData.total_price)}</strong> ke VA BCA berikut:</p>
            <div className={styles.vaBox}>{dummyVA}</div>
            
            <div style={{ marginTop: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Unggah Bukti Transfer
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ width: '100%', fontSize: '0.9rem' }}
              />
              {proofFile && <p style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.5rem' }}>✓ File terpilih: {proofFile.name}</p>}
            </div>
          </div>
        );
        
      case 'qris':
        const qrDataString = `AyamJago.dev-Tagihan-${bookingData.total_price}`;
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrDataString}`;
        return (
          <div className={styles.instructionBox}>
            <h4><Wallet size={20} /> Pembayaran QRIS</h4>
            <p>Scan kode QR di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda (Gopay, OVO, Dana, ShopeePay).</p>
            <div className={styles.qrBox}>
              <img src={qrImageUrl} alt="QR Code QRIS" width="200" height="200" />
              <strong style={{ fontSize: '1.2rem', color: '#111827' }}>
                Total: {formatPrice(bookingData.total_price)}
              </strong>
            </div>
          </div>
        );

      case 'cash':
        return (
          <div className={styles.instructionBox}>
            <h4><Banknote size={20} /> Cash on Delivery (COD)</h4>
            <p>Siapkan uang tunai pas sebesar <strong>{formatPrice(bookingData.total_price)}</strong>. Pembayaran dilakukan saat Anda mengambil kendaraan atau saat driver tiba di lokasi Anda.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.header}>
        <h2>Selesaikan Pembayaran</h2>
        <p>Langkah terakhir untuk mengamankan jadwal rental Anda.</p>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryRow}>
          <span>Kendaraan</span>
          <strong>{bookingData.vehicle_name}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Durasi Sewa</span>
          <strong>{bookingData.total_days} Hari</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Driver Opsional</span>
          <strong>{bookingData.with_driver ? 'Ya (+Biaya)' : 'Tidak'}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Metode Pembayaran</span>
          <strong style={{ textTransform: 'uppercase' }}>{bookingData.payment_method}</strong>
        </div>
        
        <div className={styles.totalRow}>
          <span>Total Tagihan</span>
          <span>{formatPrice(bookingData.total_price)}</span>
        </div>
      </div>

      {renderInstructions()}

      <button onClick={handlePaymentComplete} disabled={loading} className={styles.btnPay}>
        {bookingData.payment_method === 'transfer' ? <Upload size={20} /> : <ShieldCheck size={20} />}
        {loading ? 'Memproses Pesanan...' : 'Kirim Pemesanan & Bukti'}
      </button>
    </div>
  );
}