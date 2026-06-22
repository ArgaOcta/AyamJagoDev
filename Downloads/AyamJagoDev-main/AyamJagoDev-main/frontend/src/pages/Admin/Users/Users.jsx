import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';

export function Users() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage administrators and customer accounts.</p>
        </div>
        <button className="btn btn-solid">Add User</button>
      </div>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <UsersIcon size={32} />
        </div>
        <h3>Users Module</h3>
        <p>This section is under construction. User roles and permissions will be configured here.</p>
      </div>
    </div>
  );
}

export default Users;