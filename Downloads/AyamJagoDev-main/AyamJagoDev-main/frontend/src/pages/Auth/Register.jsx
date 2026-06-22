import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Pastikan dari react-router-dom
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, setToken } from '../../utils/api'; 
import styles from './Auth.module.css';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. State untuk menangkap input form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        full_name: fullName,
        email: email,
        password: password
      });

      console.log("Respons Register API:", response.data);

      if (response.data.token) {
        setToken(response.data.token);
        navigate('/');
      } else {
        navigate('/login');
      }

    } catch (err) {
      console.error("Register gagal:", err);
      setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={styles.authContainer}
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1738748140408-61b8965748b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwaGlnaHdheXxlbnwxfHx8fDE3NzkyNzUwODh8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
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
        <h1 className={styles.title}>Buat Akun Baru</h1>
        <p className={styles.subtitle}>Daftar sekarang untuk mulai menyewa kendaraan impianmu</p>
        
        {/* Tampilkan pesan error jika registrasi gagal */}
        {error && (
          <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nama Lengkap</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Budi Santoso" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
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
              <input 
                type={showPassword ? "text" : "password"} 
                className={styles.input} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
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
          
          <button type="submit" className={`btn btn-solid ${styles.submitBtn}`} disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Daftar Akun'}
          </button>
          
          <div className={styles.footer}>
            Sudah punya akun? 
            <Link to="/login" className={styles.footerLink}>Masuk di sini</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;