import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarCheck, 
  CreditCard,
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <CarFront size={20} />, label: 'Vehicles Fleet', path: '/admin/vehicles' },
    { icon: <CalendarCheck size={20} />, label: 'Bookings', path: '/admin/bookings' },
    { icon: <CreditCard size={20} />, label: 'Payments', path: '/admin/payments' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span>Jago.dev</span>
      </div>
      
      <nav className={styles.menu}>
        {menuItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => 
              isActive ? `${styles.menuItem} ${styles.menuItemActive}` : styles.menuItem
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
