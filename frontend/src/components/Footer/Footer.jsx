import React from 'react';
// 1. Tambahkan semua ikon Lucide yang kamu pakai di bawah ini agar tidak error
import { Mail, Phone, ArrowRight, ShieldCheck, CarFront, MapPin } from 'lucide-react';
// 2. Import ikon sosial media dari react-icons/fa (FontAwesome)
import { FaFacebook, FaInstagram } from 'react-icons/fa'; 
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.ctaPanel}>
          <div>
            <span className={styles.eyebrow}>Siap mulai perjalanan?</span>
            <h2>Booking kendaraan favoritmu dalam hitungan menit.</h2>
          </div>
          <a href="#katalog" className={styles.ctaButton}>Lihat Katalog <ArrowRight size={18} /></a>
        </div>

        <div className={styles.footerGrid}>
          <div className={styles.brandColumn}>
            <a href="#" className={styles.footerBrand}><span>AJ</span> Ayam Jago.dev</a>
            <p className={styles.footerDesc}>
              Platform rental mobil dan motor modern untuk perjalanan bisnis, keluarga, event, dan mobilitas harian dengan armada terawat serta support 24/7.
            </p>
            <div className={styles.badges}>
              <span><ShieldCheck size={15} /> Unit terverifikasi</span>
              <span><CarFront size={15} /> Pickup fleksibel</span>
            </div>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Navigasi</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>Beranda</a></li>
              <li><a href="#katalog" className={styles.footerLink}>Katalog Kendaraan</a></li>
              <li><a href="#" className={styles.footerLink}>Cara Booking</a></li>
              <li><a href="#" className={styles.footerLink}>Testimoni</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Layanan</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>Rental Harian</a></li>
              <li><a href="#" className={styles.footerLink}>Sewa Bulanan</a></li>
              <li><a href="#" className={styles.footerLink}>Corporate Fleet</a></li>
              <li><a href="#" className={styles.footerLink}>Airport Transfer</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Hubungi Kami</h4>
            <ul className={styles.contactList}>
              <li><MapPin size={16} /> Jl. Jendral Sudirman No. 123, Jakarta Selatan</li>
              <li><Mail size={16} /> info@ayamjago.dev</li>
              <li><Phone size={16} /> +62 812 3456 7890</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Ayam Jago.dev. Semua hak cipta dilindungi.</p>
          <div className={styles.socials}>
            {/* 3. Gunakan tag komponen dari react-icons di sini */}
            <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" aria-label="Facebook"><FaFacebook size={18} /></a>
          </div>
        </div> {/* Penutup div styles.footerBottom */}
      </div> {/* Penutup div container */}
    </footer> 
  );
}

export default Footer;