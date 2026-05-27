import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

function CatalogPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/vehicles`)
            .then(response => {
                setVehicles(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data kendaraan:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ minHeight: 'calc(100vh - 8rem)', padding: '20px', fontFamily: 'sans-serif', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <h1>Katalog Kendaraan AyamJago.dev</h1>
            </div>

            <div style={{ flex: 1, maxWidth: 1200, margin: '16px auto 0', width: '100%' }}>
                {loading ? (
                    <p>Memuat daftar kendaraan...</p>
                ) : vehicles.length === 0 ? (
                    <p>Belum ada kendaraan di database.</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {vehicles.map(vehicle => (
                            <div key={vehicle.id} style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: '8px', width: '250px', background: 'var(--card-bg)' }}>
                                <h3>{vehicle.brand} {vehicle.model}</h3>
                                <p><strong>Kategori:</strong> {vehicle.category}</p>
                                <p><strong>Harga:</strong> Rp {vehicle.price_per_day} / hari</p>
                                <p><strong>Status:</strong> {vehicle.status}</p>
                                
                                <button 
                                    onClick={() => navigate(`/book/${vehicle.id}`)} 
                                    style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', marginTop: '10px' }}
                                >
                                    Sewa Kendaraan
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CatalogPage;