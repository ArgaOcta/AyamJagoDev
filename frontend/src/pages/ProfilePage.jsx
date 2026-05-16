import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                    headers: getAuthHeaders()
                });
                setUserData(response.data.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Gagal memuat data profil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Memuat profil...</p>;
    if (error) return <p>{error}</p>;
    if (!userData) return <p>Gagal memuat data profil. Pastikan backend berjalan dan API tersedia.</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>← Kembali ke Katalog</button>
            
            <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2>Informasi Akun</h2>
                <p><strong>Nama Lengkap:</strong> {userData.profile.full_name}</p>
                <p><strong>Email:</strong> {userData.profile.email}</p>
                <p><strong>Role:</strong> {userData.profile.role}</p>
                <p><strong>Member Sejak:</strong> {new Date(userData.profile.created_at).toLocaleDateString('id-ID')}</p>
            </section>

            <section>
                <h2>Riwayat Penyewaan</h2>
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#eee' }}>
                        <tr>
                            <th>Kendaraan</th>
                            <th>Tanggal Sewa</th>
                            <th>Total Harga</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.history.map(book => (
                            <tr key={book.id}>
                                <td>{book.brand} {book.model}</td>
                                <td>{new Date(book.start_date).toLocaleDateString('id-ID')} - {new Date(book.end_date).toLocaleDateString('id-ID')}</td>
                                <td>Rp {Number(book.total_price).toLocaleString('id-ID')}</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        backgroundColor: book.booking_status === 'completed' ? '#d4edda' : '#fff3cd' 
                                    }}>
                                        {book.booking_status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default ProfilePage;