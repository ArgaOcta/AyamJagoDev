import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Admin/Sidebar/Sidebar';
import { Topbar } from '../components/Admin/Topbar/Topbar';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar />
        <main className={styles.scrollableArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;