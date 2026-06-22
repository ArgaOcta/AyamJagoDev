import React from 'react';
import { Search } from 'lucide-react';
import styles from './BookingBar.module.css';

export function BookingBar() {
  return (
    <div className={styles.bookingBarWrapper}>
      <div className={styles.bookingBar}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tanggal Sewa</label>
          <input type="date" className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tanggal Pengembalian</label>
          <input type="date" className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Kategori Kendaraan</label>
          <select className={styles.formSelect}>
            <option value="all">Semua Kategori</option>
            <option value="mobil">Mobil</option>
            <option value="motor">Motor</option>
          </select>
        </div>
        <button className="btn btn-solid btn-block" style={{ height: '100%', minHeight: '44px' }}>
          <Search size={18} style={{ marginRight: '8px' }} />
          Cari Kendaraan
        </button>
      </div>
    </div>
  );
}

export default BookingBar;