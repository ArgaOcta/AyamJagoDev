import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const isAdmin = () => {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role === 'admin';
        } catch (err) {
            return false;
        }
    };

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const resVehicles = await axios.get('http://localhost:5000/api/vehicles');
            // Catatan: Kamu mungkin perlu buat endpoint khusus admin untuk semua booking
            const resBookings = await axios.get('http://localhost:5000/api/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setVehicles(resVehicles.data.data);
            setBookings(Array.isArray(resBookings.data) ? resBookings.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Gagal memuat data admin:", err);
            setLoading(false);
        }
    };

    const handleDeleteVehicle = async (id) => {
        if(window.confirm("Hapus kendaraan ini?")) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Kendaraan dihapus!");
                fetchData();
            } catch (err) { alert("Gagal menghapus"); }
        }
    };

    if (loading) return <div style={styles.loader}>Menyiapkan Dashboard Admin...</div>;

    return (
        <div style={styles.container}>
            {/* Sidebar Sederhana */}
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>Admin<span style={{color: '#fff'}}>Panel</span></h2>
                <nav style={styles.nav}>
                    <div style={styles.navItemActive}>Dashboard</div>
                    <div style={styles.navItem} onClick={() => navigate('/')}>Lihat Katalog</div>
                    <div style={styles.navItem} onClick={() => {localStorage.clear(); navigate('/')}}>Logout</div>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <h1>Ringkasan Operasional</h1>
                    <button style={styles.btnAdd} onClick={() => alert("Fitur Tambah Mobil sedang disiapkan!")}>
                        + Tambah Kendaraan
                    </button>
                </header>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <label>Total Armada</label>
                        <p>{vehicles.length} Unit</p>
                    </div>
                    <div style={styles.statCard}>
                        <label>Pesanan Masuk</label>
                        <p>{bookings.length} Transaksi</p>
                    </div>
                </div>

                {/* Table Kendaraan */}
                <section style={styles.section}>
                    <h3>Kelola Armada</h3>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Mobil</th>
                                    <th>Plat Nomor</th>
                                    <th>Harga/Hari</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map(v => (
                                    <tr key={v.id}>
                                        <td><strong>{v.brand}</strong> {v.model}</td>
                                        <td>{v.license_plate}</td>
                                        <td>Rp {Number(v.price_per_day).toLocaleString()}</td>
                                        <td>
                                            <span style={{...styles.badge, backgroundColor: v.status === 'tersedia' ? '#d4edda' : '#f8d7da'}}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button style={styles.btnEdit}>Edit</button>
                                            <button style={styles.btnDelete} onClick={() => handleDeleteVehicle(v.id)}>Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' },
    sidebar: { width: '240px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px' },
    logo: { fontSize: '1.5rem', marginBottom: '40px', color: '#3498db' },
    nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s', backgroundColor: 'transparent' },
    navItemActive: { padding: '12px', borderRadius: '8px', backgroundColor: '#34495e', fontWeight: 'bold' },
    main: { flex: 1, padding: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
    statCard: { flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    section: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
    btnAdd: { backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    btnEdit: { backgroundColor: '#f1c40f', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' },
    btnDelete: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
    loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
};

export default AdminDashboard;