import React from 'react';
import { ArrowRight, CalendarCheck2, CarFront, CreditCard, KeyRound, MessageCircle } from 'lucide-react';
import styles from './HowToRent.module.css';

const steps = [
  {
    icon: <CarFront size={24} />,
    title: 'Pilih Armada',
    desc: 'Bandingkan mobil atau motor berdasarkan harga, kapasitas, transmisi, dan status ketersediaan real-time.',
    meta: '01'
  },
  {
    icon: <CalendarCheck2 size={24} />,
    title: 'Isi Jadwal Sewa',
    desc: 'Tentukan tanggal, durasi, lokasi pickup, serta opsi tambahan seperti driver profesional.',
    meta: '02'
  },
  {
    icon: <CreditCard size={24} />,
    title: 'Pembayaran & Konfirmasi',
    desc: 'Pilih metode pembayaran (Transfer, QRIS, atau COD) dan pantau status persetujuan pesanan langsung dari menu Riwayat.',
    meta: '03'
  },
  {
    icon: <KeyRound size={24} />,
    title: 'Ambil & Jalan',
    desc: 'Unit siap diantar atau diambil sesuai lokasi. Kondisi kendaraan dicek bersama sebelum jalan.',
    meta: '04'
  }
];

export function HowToRent() {
  return (
    <section className={styles.howSection} id="cara-sewa">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.introCard}>
            <span className={styles.eyebrow}>Cara Sewa</span>
            <h2>Booking kendaraan dibuat sesingkat memesan ride online.</h2>
            <p>Dari pilih armada sampai serah terima, semua alur dibuat otomatis dan transparan agar Anda tahu status pesanan di setiap tahap.</p>
            <a href="#katalog" className={styles.ctaLink}>Mulai dari katalog <ArrowRight size={17} /></a>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <article key={step.title} className={styles.stepCard}>
                <div className={styles.stepTop}>
                  <div className={styles.icon}>{step.icon}</div>
                  <span>{step.meta}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {index < steps.length - 1 && <div className={styles.connector}><ArrowRight size={18} /></div>}
              </article>
            ))}
          </div>

          {/* <div className={styles.supportBar}>
            <MessageCircle size={20} />
            <span>Butuh bantuan pilih unit? Tim Ayam Jago.dev siap merekomendasikan kendaraan sesuai kebutuhan operasional Anda.</span>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default HowToRent;