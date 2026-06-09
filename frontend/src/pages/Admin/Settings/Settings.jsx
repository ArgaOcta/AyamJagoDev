import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';

export function Settings() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure your platform preferences.</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <SettingsIcon size={32} />
        </div>
        <h3>Settings Module</h3>
        <p>This section is under construction. Global app settings will be available here.</p>
      </div>
    </div>
  );
}

export default Settings;