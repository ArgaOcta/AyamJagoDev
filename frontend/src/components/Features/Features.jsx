import React from 'react';
import { Banknote, Headphones, MapPinned, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import styles from './Features.module.css';

export function Features() {
  const featuresList = [
    {
      icon: <ShieldCheck size={24} />,
      title: 'Unit Terverifikasi',
      desc: 'Setiap armada punya checklist inspeksi, dokumen aktif, dan foto kondisi sebelum serah terima.',
      stat: '120+ titik cek'
    },
    {
      icon: <Banknote size={24} />,
      title: 'Harga Transparan',
      desc: 'Biaya sewa, driver, deposit, dan overtime dijelaskan di awal tanpa biaya tersembunyi.',
      stat: '0 hidden fee'
    },
    {
      icon: <Headphones size={24} />,
      title: 'Support 24/7',
      desc: 'Perpanjangan sewa, bantuan darurat, dan perubahan jadwal bisa dibantu kapan saja.',
      stat: '< 5 menit respons'
    },
    {
      icon: <MapPinned size={24} />,
      title: 'Pickup Fleksibel',
      desc: 'Ambil di pool, hotel, kantor, bandara, atau titik temu sesuai kebutuhan perjalanan.',
      stat: 'Multi lokasi'
    },
    {
      icon: <Wrench size={24} />,
      title: 'Maintenance Rutin',
      desc: 'Servis berkala tercatat agar kendaraan tetap nyaman untuk perjalanan kota maupun luar kota.',
      stat: 'Fleet sehat'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Pilihan Lengkap',
      desc: 'MPV keluarga, SUV premium, EV, hingga motor harian tersedia dalam satu katalog modern.',
      stat: 'Mobil & motor'
    }
  ];

  return (
    <section className={styles.featuresSection} id="kenapa-kami">
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Kenapa Memilih Kami</span>
          <h2 className={styles.sectionTitle}>Rental kendaraan yang terasa seperti layanan concierge.</h2>
          <p className={styles.sectionSubtitle}>Bukan sekadar menyediakan unit, kami merapikan pengalaman dari pencarian kendaraan sampai pengembalian.</p>
        </div>

        <div className={styles.layoutGrid}>
          <div className={styles.highlightCard}>
            <div className={styles.highlightBadge}>AJ Rental</div>
            <h3>Lebih aman, lebih jelas, lebih siap jalan.</h3>
            <p>Kami menggabungkan katalog modern, operasional armada, dan komunikasi cepat supaya sewa kendaraan terasa praktis tanpa kehilangan rasa aman.</p>
            <div className={styles.highlightStats}>
              <div><strong>98%</strong><span>booking tepat waktu</span></div>
              <div><strong>4.9</strong><span>rating pelanggan</span></div>
            </div>
          </div>

          <div className={styles.grid}>
            {featuresList.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.iconWrapper}>{feature.icon}</div>
                <div>
                  <span className={styles.stat}>{feature.stat}</span>
                  <h3 className={styles.title}>{feature.title}</h3>
                  <p className={styles.desc}>{feature.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


export default Features;