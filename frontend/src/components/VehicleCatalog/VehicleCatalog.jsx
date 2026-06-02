import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Settings } from 'lucide-react';
import styles from './VehicleCatalog.module.css';

const vehicles = [
  {
    id: 1,
    brand: 'Honda',
    name: 'CR-V 1.5 Turbo',
    price: 'Rp 600.000',
    type: 'Mobil',
    seats: 5,
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1704246125646-cfdf0cb6d2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25kYSUyMHN1diUyMGNhcnxlbnwxfHx8fDE3NzkyNzUwODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    brand: 'Toyota',
    name: 'Avanza Veloz',
    price: 'Rp 400.000',
    type: 'Mobil',
    seats: 7,
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1623371857133-6d5552bbdc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pdmFuJTIwY2FyfGVufDF8fHx8MTc3OTI3NTA4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    brand: 'Tesla',
    name: 'Model 3 Standard Range',
    price: 'Rp 1.500.000',
    type: 'Mobil',
    seats: 5,
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1696448415521-8f4dfa2e2591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMG1vZGVsJTIwMyUyMGNhcnxlbnwxfHx8fDE3NzkyNzUwODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 4,
    brand: 'Yamaha',
    name: 'NMAX 155',
    price: 'Rp 150.000',
    type: 'Motor',
    seats: 2,
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1776523460738-61be3654da88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY29vdGVyJTIwbW90b3JjeWNsZXxlbnwxfHx8fDE3NzkyNzUwODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function VehicleCatalog() {
  const navigate = useNavigate();

  return (
    <section id="katalog" className={styles.catalogSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Kendaraan Tersedia</h2>
          <p className={styles.sectionSubtitle}>Pilih kendaraan yang paling sesuai dengan kebutuhan Anda</p>
        </div>
        
        <div className={styles.catalogGrid}>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className={styles.vehicleCard}>
              <div className={styles.vehicleImageWrapper}>
                <img src={vehicle.image} alt={vehicle.name} className={styles.vehicleImage} />
                <span className={styles.statusBadge}>Tersedia</span>
              </div>
              
              <div className={styles.vehicleInfo}>
                <div className={styles.vehicleBrand}>{vehicle.brand}</div>
                <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                
                <div className={styles.vehicleFeatures}>
                  <div className={styles.feature}>
                    <Users size={16} />
                    <span>{vehicle.seats} Kursi</span>
                  </div>
                  <div className={styles.feature}>
                    <Settings size={16} />
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>
                
                <div className={styles.vehiclePriceRow}>
                  <div>
                    <span className={styles.vehiclePrice}>{vehicle.price}</span>
                    <span className={styles.vehiclePriceUnit}> / hari</span>
                  </div>
                </div>
                
                <button className="btn btn-outline btn-block">Booking</button>
                <button
                  className="btn btn-outline btn-block"
                  onClick={() => navigate(`/book/${vehicle.id}`)}
                >
                  Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VehicleCatalog;