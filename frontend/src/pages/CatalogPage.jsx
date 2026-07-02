import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Tambahkan navigasi
import axios from 'axios';
import { Armchair, Briefcase, CarFront, Fuel, Gauge, ShieldCheck, Sparkles, Tag, Zap } from 'lucide-react';
import { API_BASE_URL } from '../utils/api'; 

import styles from '../components/CatalogPage/CatalogPage.module.css';

const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(price);

const statusLabel = {
  tersedia: 'Tersedia',
  disewa: 'Sedang Disewa',
  maintenance: 'Maintenance'
};

const fuelIcon = {
  bensin: <Fuel size={16} />,
  diesel: <Fuel size={16} />,
  electric: <Zap size={16} />
};

function CatalogPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 3. Deklarasikan fungsi navigasi

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/vehicles`)
      .then(response => {
        setVehicles(response.data.data || response.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data kendaraan:", error);
        setLoading(false);
      });
  }, []);

  const DEFAULT_CAR_IMAGE = "https://placehold.co/600x400/e5e7eb/a3a3a3?text=Foto+Belum+Tersedia";

  return (
    // Mengubah ID dan menambahkan padding atas agar tidak tertutup Navbar (karena ini halaman terpisah)
    <main id="katalog-page" className={styles.catalogSection} style={{ minHeight: '100vh', paddingTop: '100px', backgroundColor: '#f9fafb' }}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Eksplorasi Armada</span>
          <h2 className={styles.sectionTitle}>Katalog Kendaraan</h2>
          <p className={styles.sectionSubtitle}>Temukan kendaraan impian untuk perjalananmu bersama AyamJago.dev. Pilih armada yang paling sesuai dengan kebutuhan spesifikasimu.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#6b7280' }}>
            <h3>Memuat daftar kendaraan...</h3>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#6b7280' }}>
            <h3>Belum ada kendaraan yang terdaftar di database.</h3>
          </div>
        ) : (
          <div className={styles.catalogGrid}>
            {vehicles.map((vehicle) => {
              const imageUrl = (vehicle.image_url && vehicle.image_url.trim() !== '') 
                ? vehicle.image_url 
                : DEFAULT_CAR_IMAGE;

              let featureList = [];
              if (Array.isArray(vehicle.features)) {
                featureList = vehicle.features;
              } else if (typeof vehicle.features === 'string') {
                featureList = vehicle.features.split(',').map(f => f.trim()).filter(f => f !== '');
              }

              const fuelType = vehicle.fuel_type?.toLowerCase() || 'bensin';
              const currentStatus = vehicle.status?.toLowerCase() || 'tersedia';

              return (
                <article key={vehicle.id} className={styles.vehicleCard}>
                  <div className={styles.vehicleImageWrapper}>
                    <img 
                      src={imageUrl} 
                      alt={`${vehicle.brand} ${vehicle.model}`} 
                      className={styles.vehicleImage}
                      onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = DEFAULT_CAR_IMAGE; 
                      }} 
                    />
                    <div className={styles.imageOverlay} />
                    <span className={`${styles.statusBadge} ${styles[currentStatus] || styles.tersedia}`}>
                      {statusLabel[currentStatus] || 'Tersedia'}
                    </span>
                    <span className={styles.categoryBadge} style={{ textTransform: 'capitalize' }}>
                      <CarFront size={14} /> {vehicle.category || 'Mobil'}
                    </span>
                  </div>

                  <div className={styles.vehicleInfo}>
                    <div className={styles.titleRow}>
                      <div>
                        <div className={styles.vehicleBrand}>{vehicle.brand}</div>
                        <h3 className={styles.vehicleName}>{vehicle.model}</h3>
                      </div>
                      <div className={styles.plate}>{vehicle.license_plate}</div>
                    </div>

                    <p className={styles.description}>{vehicle.description || 'Tidak ada deskripsi tersedia.'}</p>

                    <div className={styles.specGrid}>
                      <div className={styles.spec}>
                        <Armchair size={16} />
                        <span>
                          {vehicle.category === "motor"
                            ? `${vehicle.seat_capacity} Orang`
                            : `${vehicle.seat_capacity} Kursi`}
                        </span>
                      </div>
                      <div className={styles.spec}>
                        <Gauge size={16} />
                        <span style={{ textTransform: 'capitalize' }}>{vehicle.transmission || 'Manual'}</span>
                      </div>
                      <div className={styles.spec}>
                        {fuelIcon[fuelType] || <Fuel size={16} />}
                        <span style={{ textTransform: 'capitalize' }}>{fuelType}</span>
                      </div>
                      {vehicle.category === "mobil" && (
                        <div className={styles.spec}>
                          <Briefcase size={16} />
                          <span>{vehicle.luggage_capacity} Bagasi</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.featuresRow}>
                      {featureList.slice(0, 3).map((feature, index) => (
                        <span key={index}><Sparkles size={13} /> {feature}</span>
                      ))}
                    </div>

                    <div className={styles.vehiclePriceRow}>
                      <div>
                        <span className={styles.priceLabel}><Tag size={14} /> Mulai dari</span>
                        <div>
                          <span className={styles.vehiclePrice}>{formatPrice(vehicle.price_per_day)}</span>
                          <span className={styles.vehiclePriceUnit}> / hari</span>
                        </div>
                      </div>
                      <ShieldCheck size={22} className={styles.verifiedIcon} color="#2563eb" />
                    </div>

                    <button 
                      className={`btn btn-block ${currentStatus === 'tersedia' ? 'btn-solid' : 'btn-outline'}`} 
                      disabled={currentStatus !== 'tersedia'}
                      onClick={() => navigate(`/book/${vehicle.id}`)}
                    >
                      {currentStatus === 'tersedia' ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                    </button>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default CatalogPage;