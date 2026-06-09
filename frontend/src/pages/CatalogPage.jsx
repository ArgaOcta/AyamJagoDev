import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
// Tambahkan ikon dari lucide-react untuk mempercantik UI
import { Car, Tag, CheckCircle, XCircle } from 'lucide-react';

function CatalogPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/vehicles`)
            .then(response => {
                setVehicles(response.data.data || response.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data kendaraan:", error);
                setLoading(false);
            });
    }, []);

    // Placeholder gambar jika dari database kosong
    const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800";

    return (
        <div style={{ minHeight: 'calc(100vh - 8rem)', padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '10px' }}>Katalog Kendaraan</h1>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Temukan kendaraan impian untuk perjalananmu bersama AyamJago.dev</p>
            </div>

            <div style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>
                        <h2>Memuat daftar kendaraan...</h2>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>
                        <h2>Belum ada kendaraan di database.</h2>
                    </div>
                ) : (
                    // Menggunakan CSS Grid agar responsif dan rapi
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '30px' 
                    }}>
                        {vehicles.map(vehicle => {
                            // Cek status ketersediaan (asumsi backend mengirim 'available' atau 'tersedia')
                            const isAvailable = vehicle.status?.toLowerCase() === 'available' || vehicle.status?.toLowerCase() === 'tersedia';
                            // Cek harga (antisipasi perbedaan nama kolom price / price_per_day)
                            const price = vehicle.price_per_day || vehicle.price || 0;

                            return (
                                <div key={vehicle.id} style={{ 
                                    backgroundColor: '#ffffff', 
                                    borderRadius: '12px', 
                                    overflow: 'hidden', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'transform 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {/* Bagian Gambar */}
                                    <div style={{ height: '200px', width: '100%', position: 'relative', backgroundColor: '#e5e7eb' }}>
                                        <img 
                                            src={vehicle.image_url || DEFAULT_CAR_IMAGE} 
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = DEFAULT_CAR_IMAGE }}
                                        />
                                        {/* Badge Status */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            padding: '6px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            backgroundColor: isAvailable ? '#dcfce7' : '#fee2e2',
                                            color: isAvailable ? '#166534' : '#991b1b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {vehicle.status}
                                        </div>
                                    </div>

                                    {/* Bagian Informasi */}
                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 10px 0', color: '#111827' }}>
                                            {vehicle.brand} {vehicle.model}
                                        </h3>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <Tag size={16} />
                                            <span>{vehicle.category || 'Mobil Penumpang'}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', marginBottom: '20px', fontSize: '0.9rem' }}>
                                            <Car size={16} />
                                            <span>Tahun: {vehicle.year || 'N/A'}</span>
                                        </div>

                                        <div style={{ marginTop: 'auto' }}>
                                            <p style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#007BFF', fontWeight: 'bold' }}>
                                                Rp {Number(price).toLocaleString('id-ID')} <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 'normal' }}>/ hari</span>
                                            </p>
                                            
                                            <button 
                                                onClick={() => navigate(`/book/${vehicle.id}`)} 
                                                disabled={!isAvailable}
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '12px', 
                                                    backgroundColor: isAvailable ? '#007BFF' : '#d1d5db', 
                                                    color: isAvailable ? 'white' : '#6b7280', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    cursor: isAvailable ? 'pointer' : 'not-allowed', 
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                {isAvailable ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CatalogPage;