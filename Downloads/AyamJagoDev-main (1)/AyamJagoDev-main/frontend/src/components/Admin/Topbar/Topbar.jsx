import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';
import styles from './Topbar.module.css';

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Cari kendaraan, pelanggan, transaksi..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <MessageSquare size={20} />
          <span className={styles.badge}>3</span>
        </button>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>5</span>
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>AD</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin Utama</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
