import React from 'react';
import { ShieldCheck, Banknote, Clock } from 'lucide-react';
import styles from './Features.module.css';

export function Features() {
  const featuresList = [
    {
      icon: <ShieldCheck size={32} />,
      title: "Kendaraan Terawat",
      desc: "Semua kendaraan kami selalu melalui pengecekan rutin untuk memastikan kenyamanan dan keamanan Anda."
    },
    {
      icon: <Banknote size={32} />,
      title: "Harga Transparan",
      desc: "Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar di akhir."
    },
    {
      icon: <Clock size={32} />,
      title: "Layanan 24/7",
      desc: "Tim support kami siap membantu Anda kapanpun dan dimanapun Anda membutuhkan bantuan."
    }
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Kenapa Memilih Kami?</h2>
          <p className={styles.sectionSubtitle}>Keunggulan layanan rental kendaraan yang kami tawarkan</p>
        </div>
        
        <div className={styles.grid}>
          {featuresList.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.desc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default  Features;