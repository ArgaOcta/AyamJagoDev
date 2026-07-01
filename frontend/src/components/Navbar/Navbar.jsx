import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          AJ <span className={styles.logoText}>Rental</span>
        </Link>
        
        <nav className={styles.nav}>  
          <ul className={styles.navLinks}>
            <li><Link to="/" className={styles.navLink}>Home</Link></li>
            <li><Link to="/catalog" className={styles.navLink}>Katalog</Link></li>
            
            {isLoggedIn && (
              <li><Link to="/history" className={styles.navLink}>Riwayat</Link></li>
            )}
          </ul>
          
          <div className={styles.authButtons}>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className={styles.btnLogin}>
                  Profil
                </Link>
                <button onClick={handleLogout} className={styles.btnRegister}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.btnLogin}>
                  Login
                </Link>
                <Link to="/register" className={styles.btnRegister}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;