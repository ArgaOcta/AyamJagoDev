import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import styles from './Hero.module.css';

export function Hero() {
  const navigate = useNavigate(); // 2. Inisialisasi hook

  const handleSewaClick = () => {
    navigate('/catalog'); // 3. Arahkan ke rute katalog
  };

  return (
    <section 
      className={styles.hero} 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1738748140408-61b8965748b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwaGlnaHdheXxlbnwxfHx8fDE3NzkyNzUwODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
    >
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Sewa Kendaraan Mudah & Cepat</h1>
        <p className={styles.heroSubtitle}>
          Temukan kendaraan pilihanmu dengan harga terbaik dan proses yang transparan. 
          Pilih, pesan, dan nikmati perjalananmu tanpa ribet.
        </p>
        {/* 4. Tambahkan onClick untuk menjalankan fungsi navigasi */}
        <button 
          className={`btn btn-solid ${styles.heroCta}`} 
          onClick={handleSewaClick}
        >
          Sewa Sekarang
        </button>
      </div>
    </section>
  );
}

export default Hero;