import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Pastikan dari react-router-dom
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, setToken } from '../../utils/api'; 
import styles from './Auth.module.css';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. Tambahkan state untuk input dan status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 2. Tembak API Backend
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: email,
        password: password
      });

      console.log("Respons Login API:", response.data);

      if (response.data.token) {
        setToken(response.data.token);
      }

      const userRole = response.data.data?.user?.role || response.data.user?.role;
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error("Login gagal:", err);
      setError(err.response?.data?.message || 'Gagal masuk. Periksa kembali email dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={styles.authContainer}
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1696448415521-8f4dfa2e2591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMG1vZGVsJTIwMyUyMGNhcnxlbnwxfHx8fDE3NzkyNzUwODh8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.authCard}>

        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#4b5563', 
            textDecoration: 'none', 
            marginBottom: '20px', 
            fontSize: '14px', 
            fontWeight: '600',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
        >
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>

        <Link to="/" className={styles.logo}>Ayam Jago.dev</Link>
        <h1 className={styles.title}>Selamat Datang Kembali</h1>
        <p className={styles.subtitle}>Masuk untuk melanjutkan proses booking atau manajemen kendaraan</p>
        
        {/* Tampilkan pesan error jika login gagal */}
        {error && (
          <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              {/* Hubungkan state email dengan input */}
              <input 
                type="email" 
                className={styles.input} 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              {/* Hubungkan state password dengan input */}
              <input 
                type={showPassword ? "text" : "password"} 
                className={styles.input} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              <span>Ingat saya</span>
            </label>
            <a href="#" className={styles.forgotLink}>Lupa Password?</a>
          </div>
          
          {/* Ubah teks tombol saat loading */}
          <button type="submit" className={`btn btn-solid ${styles.submitBtn}`} disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
          
          <div className={styles.footer}>
            Belum punya akun? 
            <Link to="/register" className={styles.footerLink}>Daftar Sekarang</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;