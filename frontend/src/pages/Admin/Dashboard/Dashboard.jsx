import React from 'react';
import { 
  Car, 
  Wallet, 
  KeyRound, 
  Users,
  MoreVertical
} from 'lucide-react';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const stats = [
    { label: 'Total Kendaraan', value: '45', icon: <Car size={24} />, color: '#3b82f6' },
    { label: 'Sedang Disewa', value: '18', icon: <KeyRound size={24} />, color: '#10b981' },
    { label: 'Total Pelanggan', value: '256', icon: <Users size={24} />, color: '#f59e0b' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 45.5M', icon: <Wallet size={24} />, color: '#8b5cf6' },
  ];

  const recentBookings = [
    {
      id: 'TRX-1092',
      customer: 'Budi Santoso',
      phone: '0812-3456-7890',
      vehicle: 'Toyota Avanza Veloz',
      dateRange: '12 Okt - 15 Okt 2026',
      amount: 'Rp 1.200.000',
      status: 'active',
    },
    {
      id: 'TRX-1091',
      customer: 'Siti Aminah',
      phone: '0857-1234-5678',
      vehicle: 'Honda CR-V 1.5 Turbo',
      dateRange: '10 Okt - 12 Okt 2026',
      amount: 'Rp 1.200.000',
      status: 'completed',
    },
    {
      id: 'TRX-1090',
      customer: 'Andi Wijaya',
      phone: '0896-9876-5432',
      vehicle: 'Yamaha NMAX 155',
      dateRange: '14 Okt - 16 Okt 2026',
      amount: 'Rp 300.000',
      status: 'pending',
    },
    {
      id: 'TRX-1089',
      customer: 'Reza Rahadian',
      phone: '0813-5555-4444',
      vehicle: 'Tesla Model 3',
      dateRange: '08 Okt - 10 Okt 2026',
      amount: 'Rp 3.000.000',
      status: 'completed',
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className={`${styles.status} ${styles.statusActive}`}>Sedang Disewa</span>;
      case 'completed':
        return <span className={`${styles.status} ${styles.statusCompleted}`}>Selesai</span>;
      case 'pending':
        return <span className={`${styles.status} ${styles.statusPending}`}>Menunggu</span>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Selamat datang kembali, lihat ringkasan bisnis Anda hari ini.</p>
        </div>
        <button className="btn btn-solid">Tambah Kendaraan</button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Penyewaan Terbaru</h2>
          <button className={styles.viewAllBtn}>Lihat Semua</button>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Pelanggan</th>
                <th>Kendaraan</th>
                <th>Tanggal Sewa</th>
                <th>Total Tagihan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.id}</strong></td>
                  <td>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{booking.customer}</span>
                      <span className={styles.customerPhone}>{booking.phone}</span>
                    </div>
                  </td>
                  <td><span className={styles.vehicleInfo}>{booking.vehicle}</span></td>
                  <td>{booking.dateRange}</td>
                  <td><strong>{booking.amount}</strong></td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <button className={styles.actionBtn}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;