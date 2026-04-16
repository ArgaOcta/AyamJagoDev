import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = 1; // Sementara hardcoded sesuai user_id di BookingPage kamu
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/users/${userId}`)
            .then(res => {
                setUserData(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Memuat profil...</p>;

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
                                <td>{new Date(book.start_date).toLocaleDateString()} - {new Date(book.end_date).toLocaleDateString()}</td>
                                <td>Rp {Number(book.total_price).toLocaleString()}</td>
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