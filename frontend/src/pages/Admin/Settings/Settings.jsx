import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/api';
import { UserCog, ShieldCheck, Save } from 'lucide-react';
import styles from './Settings.module.css';

export default function Settings() {
  // State untuk Data Profil
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: ''
  });

  // State untuk Ganti Password
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Mengambil data profil admin yang sedang login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Mengisi input dengan data saat ini
        if (response.data.data && response.data.data.profile) {
          setProfileData({
            full_name: response.data.data.profile.full_name || '',
            email: response.data.data.profile.email || ''
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Submit Update Profil
  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error("Error update profile:", error);
      alert(error.response?.data?.message || 'Gagal memperbarui profil.');
    }
  };

  // Submit Update Password
  const submitPasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/users/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Password berhasil diubah!');
      // Kosongkan form password setelah berhasil
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error("Error update password:", error);
      alert(error.response?.data?.message || 'Gagal mengubah password.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pengaturan Akun</h1>
        <p className={styles.subtitle}>Perbarui informasi profil dan amankan kata sandi akses Admin Anda.</p>
      </div>

      {/* Bagian Edit Profil */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}><UserCog size={20} className="text-blue-600" /> Informasi Pribadi</h2>
        <form onSubmit={submitProfileUpdate}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nama Lengkap</label>
            <input 
              type="text" 
              name="full_name"
              className={styles.input} 
              value={profileData.full_name}
              onChange={handleProfileChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Alamat Email</label>
            <input 
              type="email" 
              name="email"
              className={styles.input} 
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </div>
          <button type="submit" className={styles.btnSubmit}>
            <Save size={16} /> Simpan Profil
          </button>
        </form>
      </div>

      {/* Bagian Ganti Password */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}><ShieldCheck size={20} className="text-green-600" /> Ganti Kata Sandi</h2>
        <form onSubmit={submitPasswordUpdate}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Kata Sandi Saat Ini</label>
            <input 
              type="password" 
              name="current_password"
              className={styles.input} 
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Kata Sandi Baru</label>
            <input 
              type="password" 
              name="new_password"
              className={styles.input} 
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              minLength="8"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Konfirmasi Kata Sandi Baru</label>
            <input 
              type="password" 
              name="confirm_password"
              className={styles.input} 
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              minLength="8"
              required
            />
          </div>
          <button type="submit" className={styles.btnSubmit}>
            <Save size={16} /> Perbarui Sandi
          </button>
        </form>
      </div>

    </div>
  );
}