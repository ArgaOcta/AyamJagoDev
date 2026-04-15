import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function CatalogPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/vehicles')
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
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Katalog Kendaraan AyamJago.dev</h1>
            
            {loading ? (
                <p>Memuat daftar kendaraan...</p>
            ) : vehicles.length === 0 ? (
                <p>Belum ada kendaraan di database.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
                            <h3>{vehicle.brand} {vehicle.model}</h3>
                            <p><strong>Kategori:</strong> {vehicle.category}</p>
                            <p><strong>Harga:</strong> Rp {vehicle.price_per_day} / hari</p>
                            <p><strong>Status:</strong> {vehicle.status}</p>
                            
                            {/* 3. Tombol ini sekarang sudah ada onClick-nya */}
                            <button 
                                onClick={() => navigate(`/book/${vehicle.id}`)} 
                                style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', marginTop: '10px' }}
                            >
                                Sewa Kendaraan
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CatalogPage;