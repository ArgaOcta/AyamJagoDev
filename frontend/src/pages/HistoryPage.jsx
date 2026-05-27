import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getAuthHeaders, isAuthenticated } from '../utils/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/history`, {
          headers: getAuthHeaders(),
        });

        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Gagal memuat riwayat:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getStatusStyle = (status) => {
    const styles = {
      completed: { bg: '#d4edda', color: '#155724' },
      active: { bg: '#cce5ff', color: '#004085' },
      pending: { bg: '#fff3cd', color: '#856404' },
      cancelled: { bg: '#f8d7da', color: '#721c24' },
      paid: { bg: '#d1ecf1', color: '#0c5460' }
    };
    return styles[status] || { bg: '#eee', color: '#333' };
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Memuat riwayat...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Riwayat Penyewaan Saya</h2>
      <p>Daftar kendaraan yang pernah Anda sewa di AyamJago.dev[cite: 25, 26].</p>
      
      {history.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd' }}>
          Belum ada riwayat transaksi.
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
              <th style={{ padding: '12px' }}>Kendaraan</th>
              <th style={{ padding: '12px' }}>Mulai Sewa</th>
              <th style={{ padding: '12px' }}>Selesai Sewa</th>
              <th style={{ padding: '12px' }}>Total Harga</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const statusStyle = getStatusStyle(item.booking_status);
              return (
                <tr key={item.id} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{item.vehicle_name}</td>
                  <td style={{ padding: '12px' }}>{new Date(item.start_date).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>{new Date(item.end_date).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>Rp {Number(item.total_price).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color
                    }}>
                      {item.booking_status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPage;