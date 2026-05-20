import React from 'react';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <div className={styles.logo}>Ayam Jago.dev</div>
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.navLink}>Home</a></li>
            <li><a href="#katalog" className={styles.navLink}>Katalog</a></li>
            <li><a href="#" className={styles.navLink}>Riwayat Sewa</a></li>
          </ul>
          <div className={styles.authButtons}>
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-solid">Register</button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;