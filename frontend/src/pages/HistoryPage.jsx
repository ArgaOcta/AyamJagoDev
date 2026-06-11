import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getAuthHeaders, isAuthenticated } from '../utils/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingBooking, setEditingBooking] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/history`,
        {
          headers: getAuthHeaders(),
        }
      );

      setHistory(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error('Gagal memuat riwayat:', error);

      if (error.response?.status === 401) {
        navigate('/login');
      }
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
      completed: { bg: '#d4edda', color: '#155724' },
      active: { bg: '#cce5ff', color: '#004085' },
      pending: { bg: '#fff3cd', color: '#856404' },
      cancelled: { bg: '#f8d7da', color: '#721c24' },
      paid: { bg: '#d1ecf1', color: '#0c5460' }
    };

    return styles[status] || {
      bg: '#eee',
      color: '#333'
    };
  };

  const handleCancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      'Apakah Anda yakin ingin membatalkan booking ini?'
    );

    if (!confirmCancel) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/api/bookings/cancel/${id}`,
        {},
        {
          headers: getAuthHeaders()
        }
      );

      alert('Booking berhasil dibatalkan');

      fetchHistory();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Gagal membatalkan booking'
      );
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);

    setEditStartDate(
      booking.start_date.split('T')[0]
    );

    setEditEndDate(
      booking.end_date.split('T')[0]
    );
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/bookings/update/${editingBooking.id}`,
        {
          vehicle_id: editingBooking.vehicle_id,
          start_date: editStartDate,
          end_date: editEndDate
        },
        {
          headers: getAuthHeaders()
        }
      );

      alert('Booking berhasil diperbarui');

      setEditingBooking(null);

      fetchHistory();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Gagal mengubah booking'
      );
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        Memuat riwayat...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ color: '#333' }}>
        Riwayat Penyewaan Saya
      </h2>

      <p>
        Daftar kendaraan yang pernah Anda sewa di
        AyamJago.dev.
      </p>

      {history.length === 0 ? (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ddd'
          }}
        >
          Belum ada riwayat transaksi.
        </div>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
            boxShadow:
              '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#2c3e50',
                color: 'white'
              }}
            >
              <th style={{ padding: '12px' }}>
                Kendaraan
              </th>

              <th style={{ padding: '12px' }}>
                Mulai Sewa
              </th>

              <th style={{ padding: '12px' }}>
                Selesai Sewa
              </th>

              <th style={{ padding: '12px' }}>
                Total Harga
              </th>

              <th style={{ padding: '12px' }}>
                Status
              </th>

              <th style={{ padding: '12px' }}>
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => {
              const statusStyle = getStatusStyle(
                item.booking_status
              );

              return (
                <tr
                  key={item.id}
                  style={{
                    textAlign: 'center',
                    borderBottom:
                      '1px solid #ddd'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    {item.vehicle_name}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {new Date(
                      item.start_date
                    ).toLocaleDateString('id-ID')}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {new Date(
                      item.end_date
                    ).toLocaleDateString('id-ID')}
                  </td>

                  <td style={{ padding: '12px' }}>
                    Rp{' '}
                    {Number(
                      item.total_price
                    ).toLocaleString('id-ID')}
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform:
                          'uppercase',
                        backgroundColor:
                          statusStyle.bg,
                        color:
                          statusStyle.color
                      }}
                    >
                      {item.booking_status}
                    </span>
                  </td>

                  <td style={{ padding: '12px' }}>
                    {item.booking_status ===
                      'pending' && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent:
                            'center'
                        }}
                      >
                        <button
                          onClick={() =>
                            handleEditBooking(
                              item
                            )
                          }
                          style={{
                            border: 'none',
                            padding:
                              '6px 10px',
                            borderRadius:
                              '6px',
                            cursor: 'pointer',
                            backgroundColor:
                              '#3498db',
                            color: 'white'
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleCancelBooking(
                              item.id
                            )
                          }
                          style={{
                            border: 'none',
                            padding:
                              '6px 10px',
                            borderRadius:
                              '6px',
                            cursor: 'pointer',
                            backgroundColor:
                              '#e74c3c',
                            color: 'white'
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {editingBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor:
              'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px'
            }}
          >
            <h3>Edit Booking</h3>

            <div
              style={{
                marginBottom: '10px'
              }}
            >
              <label>
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={editStartDate}
                onChange={(e) =>
                  setEditStartDate(
                    e.target.value
                  )
                }
                style={{
                  width: '100%',
                  padding: '8px'
                }}
              />
            </div>

            <div
              style={{
                marginBottom: '10px'
              }}
            >
              <label>
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={editEndDate}
                onChange={(e) =>
                  setEditEndDate(
                    e.target.value
                  )
                }
                style={{
                  width: '100%',
                  padding: '8px'
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px'
              }}
            >
              <button
                onClick={handleSaveEdit}
              >
                Simpan
              </button>

              <button
                onClick={() =>
                  setEditingBooking(
                    null
                  )
                }
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;