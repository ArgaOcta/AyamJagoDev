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
    { label: 'Total Vehicles', value: '45', icon: <Car size={24} />, color: '#3b82f6' },
    { label: 'Active Bookings', value: '18', icon: <KeyRound size={24} />, color: '#10b981' },
    { label: 'Total Users', value: '256', icon: <Users size={24} />, color: '#f59e0b' },
    { label: 'Total Revenue', value: '$45,500', icon: <Wallet size={24} />, color: '#8b5cf6' },
  ];

  const recentBookings = [
    {
      id: 'BKG-1092',
      customer: 'Budi Santoso',
      vehicle: 'Toyota Avanza Veloz',
      startDate: 'Oct 12, 2026',
      endDate: 'Oct 15, 2026',
      status: 'active', // active, completed, pending
    },
    {
      id: 'BKG-1091',
      customer: 'Siti Aminah',
      vehicle: 'Honda CR-V 1.5 Turbo',
      startDate: 'Oct 10, 2026',
      endDate: 'Oct 12, 2026',
      status: 'completed',
    },
    {
      id: 'BKG-1090',
      customer: 'Andi Wijaya',
      vehicle: 'Yamaha NMAX 155',
      startDate: 'Oct 14, 2026',
      endDate: 'Oct 16, 2026',
      status: 'pending',
    },
    {
      id: 'BKG-1089',
      customer: 'Reza Rahadian',
      vehicle: 'Tesla Model 3',
      startDate: 'Oct 08, 2026',
      endDate: 'Oct 10, 2026',
      status: 'completed',
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className={`${styles.status} ${styles.statusActive}`}>Active</span>;
      case 'completed':
        return <span className={`${styles.status} ${styles.statusCompleted}`}>Completed</span>;
      case 'pending':
        return <span className={`${styles.status} ${styles.statusPending}`}>Pending</span>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back, here is your business summary for today.</p>
        </div>
        <button className="btn btn-solid">Add Vehicle</button>
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
          <h2 className={styles.sectionTitle}>Recent Bookings</h2>
          <button className={styles.viewAllBtn}>View All</button>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer Name</th>
                <th>Vehicle Model</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.id}</strong></td>
                  <td>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{booking.customer}</span>
                    </div>
                  </td>
                  <td><span className={styles.vehicleInfo}>{booking.vehicle}</span></td>
                  <td>{booking.startDate}</td>
                  <td>{booking.endDate}</td>
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