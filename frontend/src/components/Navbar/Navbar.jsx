import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { clearToken, getDecodedToken, isAuthenticated } from '../../utils/api';
import { Moon, Sun } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const user = isAuthenticated() ? getDecodedToken() : null;
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const initials = user
    ? (user.full_name
        ? user.full_name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : (user.email ? user.email[0].toUpperCase() : 'U'))
    : '';

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>Ayam Jago.dev</div>

        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/catalog'
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                }
              >
                Katalog
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/history'
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                }
              >
                Riwayat
              </NavLink>
            </li>
          </ul>

          <div className={styles.authButtons}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={toggleTheme} 
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            {user ? (
              <>
                <span className={styles.userLabel}>
                  Halo, {user.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Pengguna'}
                </span>
                <div className={styles.avatarWrapper} onClick={() => navigate('/profile')} title="Profil">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatarInitials}>{initials}</div>
                  )}
                  <span className={styles.avatarBadge} />
                </div>
              </>
            ) : (
              <> 
                <Link to="/login">
                  <button className="btn btn-outline">
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button className="btn btn-solid">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}