import React from 'react';
import { CreditCard } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';

export function Payments() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payments</h1>
          <p className={styles.subtitle}>Track transactions and revenue.</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <CreditCard size={32} />
        </div>
        <h3>Payments Module</h3>
        <p>This section is under construction. Check back soon for the transaction history list.</p>
      </div>
    </div>
  );
}

export default Payments;