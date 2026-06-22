import React from 'react';
import styles from './Testimonials.module.css';

export function Testimonials() {
  const testimonials = [
    {
      quote: "Sangat puas dengan pelayanannya. Mobil sangat bersih dan wangi, proses serah terima juga sangat cepat tanpa ribet.",
      name: "Budi Santoso",
      role: "Wiraswasta",
      initial: "B"
    },
    {
      quote: "Harganya sangat kompetitif dibanding yang lain. Saya sewa motor untuk keliling kota selama 3 hari dan kondisinya prima.",
      name: "Siti Aminah",
      role: "Mahasiswa",
      initial: "S"
    },
    {
      quote: "Layanan pelanggan 24 jam sangat membantu ketika saya butuh perpanjang masa sewa mendadak. Terima kasih Ayam Jago!",
      name: "Andi Wijaya",
      role: "Pegawai Swasta",
      initial: "A"
    }
  ];

  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Apa Kata Mereka</h2>
          <p className={styles.sectionSubtitle}>Pengalaman nyata dari pelanggan kami</p>
        </div>
        
        <div className={styles.grid}>
          {testimonials.map((testi, index) => (
            <div key={index} className={styles.card}>
              <p className={styles.quote}>"{testi.quote}"</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{testi.initial}</div>
                <div>
                  <div className={styles.name}>{testi.name}</div>
                  <div className={styles.role}>{testi.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;