<<<<<<< HEAD
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
=======
﻿import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  API_BASE_URL,
  getDecodedToken,
  getAuthHeaders,
  getLocalProfile,
  clearToken,
  setToken,
  updateLocalUser,
  updateLocalUserAvatar,
  changeLocalUserPassword,
  deleteLocalUser,
  createLocalToken,
} from '../utils/api';
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD
    const userId = 1;
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
=======
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editForm, setEditForm] = useState({ full_name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const decodedToken = getDecodedToken();
    const userId = decodedToken?.id;

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        axios.get(`${API_BASE_URL}/api/users/profile`, { headers: getAuthHeaders() })
            .then(res => {
                setUserData(res.data.data);
                setEditForm({
                    full_name: res.data.data.profile.full_name,
                    email: res.data.data.profile.email,
                });
                setLoading(false);
            })
            .catch(err => {
                console.warn('Backend profile gagal, gunakan profil lokal jika ada.', err.message || err);
                const localProfile = getLocalProfile();
                if (localProfile) {
                    setUserData(localProfile);
                    setEditForm({
                        full_name: localProfile.profile.full_name,
                        email: localProfile.profile.email,
                    });
                } else {
                    setError('Gagal memuat data profil. Silakan login ulang.');
                }
                setLoading(false);
            });
    }, [userId, navigate]);

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Yakin ingin menghapus akun Anda? Semua data akan hilang permanen.');
        if (!confirmDelete) {
            return;
        }

        setDeletingAccount(true);
        setSuccessMessage('');
        setError('');

        try {
            await axios.delete(`${API_BASE_URL}/api/users/profile`, { headers: getAuthHeaders() });
            clearToken();
            navigate('/register');
        } catch (err) {
            const backendError = err.response?.data?.message;
            if (backendError) {
                setError(backendError);
                setDeletingAccount(false);
                return;
            }

            const decoded = getDecodedToken();
            const localResult = deleteLocalUser({ id: decoded?.id });
            if (localResult.success) {
                clearToken();
                setSuccessMessage('Akun lokal berhasil dihapus. Mengarahkan ke halaman pendaftaran...');
                setTimeout(() => navigate('/register'), 1200);
            } else {
                setError(localResult.message);
            }
            setDeletingAccount(false);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Hanya file gambar yang diperbolehkan.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Ukuran gambar tidak boleh lebih dari 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async () => {
        if (!avatarPreview) {
            setError('Silakan pilih gambar terlebih dahulu.');
            return;
        }

        setUploadingAvatar(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/users/avatar`,
                { avatar_data: avatarPreview },
                { headers: getAuthHeaders() }
            );

            const updatedProfile = response.data.data.profile;
            if (response.data.token) {
                setToken(response.data.token);
            }
            setUserData((prev) => ({ ...prev, profile: updatedProfile }));
            setAvatarPreview(null);
            setSuccessMessage('Avatar berhasil diperbarui.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            const backendError = err.response?.data?.message;
            if (backendError) {
                setError(backendError);
                setUploadingAvatar(false);
                return;
            }

            // Fallback to local storage
            const decoded = getDecodedToken();
            const localResult = updateLocalUserAvatar({
                id: decoded?.id,
                avatar_url: avatarPreview,
            });

            if (localResult.success) {
                createLocalToken(localResult.user);
                setUserData((prev) => ({ ...prev, profile: localResult.user }));
                setAvatarPreview(null);
                setSuccessMessage('Avatar lokal berhasil diperbarui.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setError(localResult.message);
            }
        }
        setUploadingAvatar(false);
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setSuccessMessage('');
        setError('');

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/users/profile`,
                {
                    full_name: editForm.full_name,
                    email: editForm.email,
                },
                { headers: getAuthHeaders() }
            );

            const updatedProfile = response.data.data.profile;
            if (response.data.token) {
              setToken(response.data.token);
            }
            setUserData((prev) => ({ ...prev, profile: updatedProfile }));
            setSuccessMessage('Profil berhasil diperbarui.');
            setSavingProfile(false);
        } catch (err) {
            const backendError = err.response?.data?.message;
            if (backendError) {
                setError(backendError);
                setSavingProfile(false);
                return;
            }

            const decoded = getDecodedToken();
            const localResult = updateLocalUser({
                id: decoded?.id,
                full_name: editForm.full_name,
                email: editForm.email,
            });

            if (localResult.success) {
                createLocalToken(localResult.user);
                setUserData((prev) => ({ ...prev, profile: localResult.user }));
                setSuccessMessage('Profil lokal berhasil diperbarui.');
            } else {
                setError(localResult.message);
            }
            setSavingProfile(false);
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setChangingPassword(true);
        setSuccessMessage('');
        setError('');

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/users/password`,
                {
                    current_password: passwordForm.current_password,
                    new_password: passwordForm.new_password,
                    confirm_password: passwordForm.confirm_password,
                },
                { headers: getAuthHeaders() }
            );

            setSuccessMessage(response.data.message || 'Password berhasil diubah.');
            setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
            setChangingPassword(false);
        } catch (err) {
            const backendError = err.response?.data?.message;
            if (backendError) {
                setError(backendError);
                setChangingPassword(false);
                return;
            }

            const decoded = getDecodedToken();
            const localResult = changeLocalUserPassword({
                id: decoded?.id,
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
            });

            if (localResult.success) {
                setSuccessMessage('Password lokal berhasil diubah.');
                setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
            } else {
                setError(localResult.message);
            }
            setChangingPassword(false);
        }
    };

    if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Memuat profil...</p>;

    if (error) return <p style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</p>;

    if (!userData) return <p style={{ padding: '2rem', textAlign: 'center' }}>Gagal memuat data profil. Pastikan backend berjalan dan API tersedia.</p>;

    const initials = userData.profile.full_name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const history = userData.history || [];
    const totalBooked = history.length;
    const totalSpent = history.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
    const lastBooking = history[0];
    const latestBookingDate = lastBooking ? new Date(lastBooking.start_date).toLocaleDateString('id-ID') : '-';

    return (
        <div className='profile-wrapper'>
            <div className='profile-container'>
                <section className='profile-hero'>
                    <div className='profile-hero-card'>
                        <div className='profile-hero-left'>
                            <div 
                                className='profile-avatar profile-avatar-large profile-avatar-interactive'
                                onClick={() => fileInputRef.current?.click()}
                                title='Klik untuk mengubah avatar'
                            >
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt='Avatar preview' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : userData.profile.avatar_url ? (
                                    <img src={userData.profile.avatar_url} alt='Avatar' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    initials
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='image/*'
                                onChange={handleAvatarSelect}
                                style={{ display: 'none' }}
                            />
                            <div>
                                <span className='badge'>Member {userData.profile.role === 'admin' ? 'Admin' : 'Rental'}</span>
                                <h1 className='profile-title hero-title'>{userData.profile.full_name}</h1>
                                <p className='profile-meta hero-meta'>Kelola profil, lihat riwayat pemesanan, dan kelola akun rental kendaraan Anda dengan mudah.</p>
                                <div className='profile-hero-tags'>
                                    <span>{userData.profile.email}</span>
                                    <span>Terdaftar sejak {new Date(userData.profile.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                        <div className='profile-hero-actions'>
                            <button className='btn btn-solid' onClick={() => navigate('/')}>Beranda</button>
                        </div>
                    </div>

                    <div className='profile-metrics-grid'>
                        <div className='profile-metric-card'>
                            <span className='metric-label'>Total Penyewaan</span>
                            <strong className='metric-value'>{totalBooked}</strong>
                        </div>
                        <div className='profile-metric-card'>
                            <span className='metric-label'>Total Pengeluaran</span>
                            <strong className='metric-value'>Rp {totalSpent.toLocaleString('id-ID')}</strong>
                        </div>
                        <div className='profile-metric-card'>
                            <span className='metric-label'>Booking Terakhir</span>
                            <strong className='metric-value'>{latestBookingDate}</strong>
                        </div>
                    </div>
                </section>

                <section className='profile-main-grid'>
                    <div className='profile-main-column'>
                        <div className='profile-card profile-summary-card'>
                            <div className='profile-card-header'>
                                <div>
                                    <h2>Profil Anda</h2>
                                    <p className='profile-card-subtitle'>Detail akun dan informasi dasar untuk profil rental.</p>
                                </div>
                            </div>
                            <div className='profile-summary-grid'>
                                <div className='profile-summary-item'>
                                    <span>Nama Lengkap</span>
                                    <strong>{userData.profile.full_name}</strong>
                                </div>
                                <div className='profile-summary-item'>
                                    <span>Email</span>
                                    <strong>{userData.profile.email}</strong>
                                </div>
                                <div className='profile-summary-item'>
                                    <span>Peran</span>
                                    <strong>{userData.profile.role}</strong>
                                </div>
                                <div className='profile-summary-item'>
                                    <span>Tanggal Pendaftaran</span>
                                    <strong>{new Date(userData.profile.created_at).toLocaleDateString('id-ID')}</strong>
                                </div>
                            </div>
                        </div>

                        <div className='profile-card'>
                            <h2>Ubah Avatar</h2>
                            <p className='profile-card-subtitle'>Klik avatar di atas atau gunakan tombol di bawah untuk mengganti foto profil Anda.</p>
                            <button 
                                className='btn btn-outline btn-block' 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                            >
                                Pilih Gambar
                            </button>
                            {avatarPreview && (
                                <div className='avatar-preview-section'>
                                    <p className='profile-card-subtitle'>Preview Avatar:</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <div 
                                            className='profile-avatar profile-avatar-large'
                                            style={{ border: '2px solid var(--primary)' }}
                                        >
                                            <img src={avatarPreview} alt='Avatar preview' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <button 
                                                className='btn btn-solid' 
                                                onClick={uploadAvatar}
                                                disabled={uploadingAvatar}
                                            >
                                                {uploadingAvatar ? 'Mengunggah...' : 'Unggah Avatar'}
                                            </button>
                                            <button 
                                                className='btn btn-outline'
                                                onClick={() => {
                                                    setAvatarPreview(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                disabled={uploadingAvatar}
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='profile-card'>
                            <h2>Perbarui Profil</h2>
                            <form onSubmit={saveProfile} className='form-grid'>
                                <div className='profile-info-card'>
                                    <label className='profile-info-label' htmlFor='full_name'>Nama Lengkap</label>
                                    <input
                                        id='full_name'
                                        name='full_name'
                                        value={editForm.full_name}
                                        onChange={handleEditChange}
                                        type='text'
                                        className='profile-input'
                                        required
                                    />
                                </div>
                                <div className='profile-info-card'>
                                    <label className='profile-info-label' htmlFor='email'>Email</label>
                                    <input
                                        id='email'
                                        name='email'
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        type='email'
                                        className='profile-input'
                                        required
                                    />
                                </div>
                                <button className='btn btn-solid btn-block' type='submit' disabled={savingProfile}>
                                    {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
                                </button>
                            </form>
                        </div>

                        <div className='profile-card'>
                            <h2>Ubah Password</h2>
                            <form onSubmit={updatePassword} className='form-grid'>
                                <div className='profile-info-card'>
                                    <label className='profile-info-label' htmlFor='current_password'>Password Saat Ini</label>
                                    <input
                                        id='current_password'
                                        name='current_password'
                                        type='password'
                                        value={passwordForm.current_password}
                                        onChange={handlePasswordChange}
                                        className='profile-input'
                                        required
                                    />
                                </div>
                                <div className='profile-info-card'>
                                    <label className='profile-info-label' htmlFor='new_password'>Password Baru</label>
                                    <input
                                        id='new_password'
                                        name='new_password'
                                        type='password'
                                        value={passwordForm.new_password}
                                        onChange={handlePasswordChange}
                                        className='profile-input'
                                        required
                                    />
                                </div>
                                <div className='profile-info-card'>
                                    <label className='profile-info-label' htmlFor='confirm_password'>Konfirmasi Password</label>
                                    <input
                                        id='confirm_password'
                                        name='confirm_password'
                                        type='password'
                                        value={passwordForm.confirm_password}
                                        onChange={handlePasswordChange}
                                        className='profile-input'
                                        required
                                    />
                                </div>
                                <button className='btn btn-outline btn-block' type='submit' disabled={changingPassword}>
                                    {changingPassword ? 'Mengubah password...' : 'Ubah Password'}
                                </button>
                            </form>
                        </div>

                        {successMessage && (
                            <div className='profile-alert success-alert'>
                                {successMessage}
                            </div>
                        )}
                        {error && (
                            <div className='profile-alert error-alert'>
                                {error}
                            </div>
                        )}
                    </div>

                    <aside className='profile-side'>
                        <div className='profile-card profile-side-card'>
                            <h3>Ringkasan Terakhir</h3>
                            {lastBooking ? (
                                <div className='profile-side-info'>
                                    <p className='profile-side-label'>Kendaraan</p>
                                    <strong>{lastBooking.brand} {lastBooking.model}</strong>
                                    <p className='profile-side-label'>Periode</p>
                                    <p>{new Date(lastBooking.start_date).toLocaleDateString('id-ID')} - {new Date(lastBooking.end_date).toLocaleDateString('id-ID')}</p>
                                    <p className='profile-side-label'>Status</p>
                                    <p>{lastBooking.booking_status}</p>
                                </div>
                            ) : (
                                <p className='profile-side-empty'>Belum ada pemesanan terakhir. Ayo pilih kendaraan sekarang!</p>
                            )}
                        </div>

                        <div className='profile-card profile-side-card'>
                            <h3>Bantuan & Dukungan</h3>
                            <p>Kami siap membantu untuk pemesanan kendaraan, pengembalian, dan dukungan akun.</p>
                            <div className='profile-support-list'>
                                <div>
                                    <strong>Email</strong>
                                    <p>support@ayamjagodev.com</p>
                                </div>
                                <div>
                                    <strong>Telepon</strong>
                                    <p>+62 812 3456 7890</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>

                <div className='profile-card profile-history-card'>
                    <h2>Riwayat Penyewaan</h2>
                    {history.length > 0 ? (
                        <div className='profile-history'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Kendaraan</th>
                                        <th>Tanggal Sewa</th>
                                        <th>Total Harga</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((book) => (
                                        <tr key={book.id}>
                                            <td>{book.brand} {book.model}</td>
                                            <td>{new Date(book.start_date).toLocaleDateString('id-ID')} - {new Date(book.end_date).toLocaleDateString('id-ID')}</td>
                                            <td>Rp {Number(book.total_price).toLocaleString('id-ID')}</td>
                                            <td>{book.booking_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='profile-empty'>
                            <p>Belum ada riwayat penyewaan. Ayo mulai pilih kendaraan dan pesan sekarang.</p>
                        </div>
                    )}
                </div>

                <div className='profile-logout-section'>
                    <button className='btn btn-outline profile-logout-btn' onClick={handleLogout}>
                        Logout
                    </button>
                    <button className='btn btn-destructive profile-logout-btn' onClick={handleDeleteAccount} disabled={deletingAccount}>
                        {deletingAccount ? 'Menghapus...' : 'Hapus Akun'}
                    </button>
                </div>
            </div>
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd
        </div>
    );
}

<<<<<<< HEAD
export default ProfilePage;
=======
export default ProfilePage;
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd
