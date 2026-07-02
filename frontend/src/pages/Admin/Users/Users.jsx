import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/api';
import { User, Shield, Trash2, Mail, Calendar } from 'lucide-react';
import styles from './Users.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data seluruh pengguna dari backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // Pastikan kamu memiliki endpoint ini di backend (misal: userRoutes.js)
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data || response.data || [];
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi untuk menghapus pengguna
  const handleDelete = async (id, role) => {
    if (role === 'admin') {
      alert('Tidak dapat menghapus akun dengan hak akses Admin!');
      return;
    }

    if (window.confirm('Yakin ingin menghapus pengguna ini? Semua data terkait mungkin akan ikut terhapus.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert('Pengguna berhasil dihapus!');
        fetchUsers(); 
      } catch (error) {
        console.error("Error deleting user:", error);
        alert('Gagal menghapus pengguna. Pengguna mungkin memiliki riwayat transaksi aktif.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manajemen Pengguna</h1>
        <p className={styles.subtitle}>Kelola akun pelanggan dan staf admin yang terdaftar di sistem.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Informasi Akun</th>
              <th>Hak Akses (Role)</th>
              <th>Tanggal Daftar</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data pengguna...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data pengguna terdaftar.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className={styles.primaryText}>
                    #{user.id}
                  </td>
                  
                  <td>
                    <div className={styles.primaryText}>
                      <User size={16} className="text-gray-400" />
                      {user.name || user.full_name || 'Tanpa Nama'}
                    </div>
                    <div className={styles.secondaryText}>
                      <Mail size={12} />
                      {user.email}
                    </div>
                  </td>
                  
                  <td>
                    <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}`}>
                      {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                      {user.role || 'user'}
                    </span>
                  </td>
                  
                  <td>
                    <div className={styles.secondaryText}>
                      <Calendar size={14} />
                      {formatDate(user.created_at)}
                    </div>
                  </td>
                  
                  <td>
                    <div className={styles.actionGroup}>
                      <button 
                        onClick={() => handleDelete(user.id, user.role)} 
                        title="Hapus Pengguna"
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                        disabled={user.role === 'admin'}
                        style={{ opacity: user.role === 'admin' ? 0.3 : 1, cursor: user.role === 'admin' ? 'not-allowed' : 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}