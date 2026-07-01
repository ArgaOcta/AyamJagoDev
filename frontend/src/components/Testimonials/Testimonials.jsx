import React from 'react';
import { Star, Quote, ShieldCheck, Clock3, MapPin } from 'lucide-react';
import styles from './Testimonials.module.css';

export function Testimonials() {
  const testimonials = [
    {
      quote: 'Unit Ioniq 5 datang tepat waktu, baterai penuh, interior bersih, dan admin memberi update posisi driver sampai serah terima.',
      name: 'Nadia Putri',
      role: 'Event Producer',
      initial: 'NP',
      trip: 'Jakarta • 4 hari',
      rating: '5.0'
    },
    {
      quote: 'Saya sering sewa untuk perjalanan bisnis. Invoice rapi, pilihan mobil banyak, dan proses extend bisa lewat WhatsApp tanpa drama.',
      name: 'Raka Prameswara',
      role: 'Regional Sales Lead',
      initial: 'RP',
      trip: 'Bandung • 2 hari',
      rating: '4.9'
    },
    {
      quote: 'Motor NMAX-nya prima untuk mobilitas kota. Helm, jas hujan, dan dokumen sudah siap. Terasa seperti layanan rental premium.',
      name: 'Maya Lestari',
      role: 'Travel Creator',
      initial: 'ML',
      trip: 'Yogyakarta • 3 hari',
      rating: '5.0'
    }
  ];

  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.topGrid}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Customer Stories</span>
            <h2 className={styles.sectionTitle}>Dipercaya untuk perjalanan yang waktunya tidak boleh meleset.</h2>
          </div>
          <div className={styles.scoreCard}>
            <div className={styles.score}>4.9</div>
            <div>
              <div className={styles.stars}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p>Rata-rata rating dari 1.200+ booking terverifikasi.</p>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testi) => (
            <article key={testi.name} className={styles.card}>
              <div className={styles.cardTop}>
                <Quote size={24} />
                <span>{testi.rating}</span>
              </div>
              <p className={styles.quote}>{testi.quote}</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{testi.initial}</div>
                <div>
                  <div className={styles.name}>{testi.name}</div>
                  <div className={styles.role}>{testi.role}</div>
                </div>
              </div>
              <div className={styles.trip}><MapPin size={14} /> {testi.trip}</div>
            </article>
          ))}
        </div>

        <div className={styles.trustStrip}>
          <div><ShieldCheck size={18} /><span>Unit terinspeksi sebelum jalan</span></div>
          <div><Clock3 size={18} /><span>Support operasional 24/7</span></div>
          <div><Star size={18} /><span>Booking cepat tanpa deposit rumit</span></div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;