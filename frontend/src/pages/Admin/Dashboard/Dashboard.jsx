import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/api';
import { Car, Wallet, KeyRound, Users, MoreVertical } from 'lucide-react';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, active: 0, users: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Pastikan backend memiliki endpoint ini
        const res = await axios.get(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats);
        setBookings(res.data.recentBookings);
      } catch (err) { console.error("Error fetching dashboard data"); }
    };
    fetchData();
  }, []);

  const statsList = [
    { label: 'Total Vehicles', value: stats.vehicles, icon: <Car size={24} />, color: '#2563eb' },
    { label: 'Active Bookings', value: stats.active, icon: <KeyRound size={24} />, color: '#059669' },
    { label: 'Total Users', value: stats.users, icon: <Users size={24} />, color: '#d97706' },
    { label: 'Total Revenue', value: `Rp ${stats.revenue.toLocaleString()}`, icon: <Wallet size={24} />, color: '#7c3aed' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Dashboard Overview</h1><p className={styles.subtitle}>Ringkasan bisnis Anda hari ini.</p></div>
      </div>

      <div className={styles.statsGrid}>
        {statsList.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: stat.color }}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>Recent Bookings</h2>
        <table className={styles.table}>
          <thead><tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Status</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.customer_name}</td><td>{b.vehicle_model}</td>
                <td><span className={`${styles.status} ${styles[`status${b.status.charAt(0).toUpperCase() + b.status.slice(1)}`]}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;