import React from 'react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div>
            <a href="#" className={styles.footerBrand}>Ayam Jago.dev</a>
            <p className={styles.footerDesc}>
              Platform penyewaan kendaraan terpercaya yang memberikan kemudahan dalam 
              memesan mobil dan motor untuk berbagai keperluan perjalanan Anda dengan 
              harga yang kompetitif dan layanan pelanggan 24/7.
            </p>
          </div>
          
          <div>
            <h4 className={styles.footerTitle}>Tautan Cepat</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>Beranda</a></li>
              <li><a href="#katalog" className={styles.footerLink}>Katalog Kendaraan</a></li>
              <li><a href="#" className={styles.footerLink}>Syarat & Ketentuan</a></li>
              <li><a href="#" className={styles.footerLink}>Kebijakan Privasi</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={styles.footerTitle}>Kontak Kami</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink}>Jl. Jendral Sudirman No. 123</li>
              <li className={styles.footerLink}>Jakarta Selatan, 12190</li>
              <li className={styles.footerLink}>info@ayamjago.dev</li>
              <li className={styles.footerLink}>+62 812 3456 7890</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Ayam Jago.dev. Hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;