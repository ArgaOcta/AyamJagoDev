import React, { useState } from 'react';
// Tambahkan useParams di sini
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Calendar, CreditCard, Car, ArrowLeft } from 'lucide-react';
import { API_BASE_URL, getDecodedToken } from '../utils/api';

export function BookingPage() {
  const navigate = useNavigate();
  
  // Tangkap parameter 'id' dari URL (misalnya /booking/5)
  const { vehicleId: urlVehicleId } = useParams(); 

  // Masukkan 'id' dari URL sebagai nilai awal state vehicleId
  const [vehicleId, setVehicleId] = useState(urlVehicleId || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer_bank');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token'); 

    if (!token) {
      setError('Anda harus login terlebih dahulu untuk menyewa kendaraan.');
      setIsLoading(false);
      return;
    }

    const decodedToken = getDecodedToken();
    const userId = decodedToken?.id;

    if (!userId) {
      setError('Sesi tidak valid. Silakan coba login ulang.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        {
          user_id: userId,
          vehicle_id: vehicleId,
          start_date: startDate,
          end_date: endDate,
          payment_method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Respons Booking API:', response.data);
      setSuccess('Pemesanan berhasil dibuat! Mengalihkan ke riwayat transaksi...');
      
      setStartDate('');
      setEndDate('');
      
      setTimeout(() => {
        navigate('/history');
      }, 2000);

    } catch (err) {
      console.error('Error saat booking:', err);
      setError(
        err.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan. Pastikan data valid.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={20} /> Kembali
      </button>

      <h2>Formulir Penyewaan Kendaraan</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Silakan lengkapi data di bawah ini untuk membuat pesanan.</p>

      {error && <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

      <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Input ID Kendaraan (Dibuat Read-Only agar tidak bisa diedit user) */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>ID Kendaraan</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#f3f4f6' }}>
            <Car size={18} style={{ marginRight: '10px', color: '#666' }} />
            <input 
              type="number" 
              value={vehicleId}
              readOnly // <--- Mencegah user mengubah ID secara manual
              style={{ border: 'none', outline: 'none', width: '100%', backgroundColor: 'transparent', color: '#6b7280', fontWeight: 'bold' }}
            />
          </div>
        </div>

        {/* Input Tanggal Mulai */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tanggal Mulai Sewa</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
            <Calendar size={18} style={{ marginRight: '10px', color: '#666' }} />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{ border: 'none', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        {/* Input Tanggal Selesai */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tanggal Selesai Sewa</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
            <Calendar size={18} style={{ marginRight: '10px', color: '#666' }} />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{ border: 'none', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        {/* Dropdown Metode Pembayaran */}
       <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Metode Pembayaran</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
            <CreditCard size={18} style={{ marginRight: '10px', color: '#666' }} />
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
            >
              {/* Value disamakan persis dengan kebutuhan validasi backend */}
              <option value="transfer">Transfer Bank</option>
              <option value="cash">Bayar Tunai (Cash / COD)</option>
              <option value="qris">E-Wallet / QRIS</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            marginTop: '10px', 
            padding: '12px', 
            background: isLoading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}
        </button>

      </form>
    </div>
  );
}

export default BookingPage;