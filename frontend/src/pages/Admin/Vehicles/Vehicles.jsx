import React from 'react';
import { CarFront } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';

export default function Vehicles() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vehicles Fleet</h1>
          <p className={styles.subtitle}>Manage your vehicle inventory and statuses.</p>
        </div>
        <button className="btn btn-solid">Add Vehicle</button>
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <CarFront size={32} />
        </div>
        <h3>Vehicles Module</h3>
        <p>This section is under construction. Future updates will allow you to add, edit, and remove vehicles.</p>
      </div>
    </div>
  );
}