import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, CarFront, CheckCircle2, Clock3, CreditCard, Fuel, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import styles from './Booking.module.css';
import { API_BASE_URL } from '../../utils/api'; 

const formatPrice = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(value);

export function BookingPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedVehicleId, setSelectedVehicleId] = useState(id || '');
  const [duration, setDuration] = useState(3);
  const [withDriver, setWithDriver] = useState(false);
  
  const [formData, setFormData] = useState({
    start_date: '',
    pickup_time: '',
    pickup_location: '',
    notes: '',
    payment_method: 'transfer' 
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/vehicles`)
      .then(response => {
        const fetchedVehicles = response.data.data || response.data || [];
        setVehicles(fetchedVehicles);
        
        if (id && fetchedVehicles.some(v => v.id.toString() === id)) {
          setSelectedVehicleId(id);
        } else if (fetchedVehicles.length > 0) {
          setSelectedVehicleId(fetchedVehicles[0].id.toString());
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal memuat kendaraan:", error);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedVehicle = vehicles.find((v) => v.id.toString() === selectedVehicleId.toString()) || null;

  const total = useMemo(() => {
    if (!selectedVehicle) return 0;
    const basePrice = Number(selectedVehicle.price_per_day || selectedVehicle.price || 0);
    return (basePrice * duration) + (withDriver ? 250000 * duration : 0);
  }, [selectedVehicle, duration, withDriver]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.start_date) {
      alert("Silakan pilih tanggal mulai sewa terlebih dahulu!");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Anda harus login terlebih dahulu untuk melakukan booking!");
      navigate('/login');
      return;
    }

    const startDateObj = new Date(formData.start_date);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + duration);
    const calculatedEndDate = endDateObj.toISOString().split('T')[0];

    const bookingData = {
      vehicle_id: parseInt(selectedVehicleId),
      start_date: formData.start_date,
      end_date: calculatedEndDate,
      total_days: duration,
      total_price: total, // Hasil perhitungan useMemo
      pickup_time: formData.pickup_time,
      pickup_location: formData.pickup_location,
      notes: formData.notes,
      with_driver: withDriver,
      payment_method: formData.payment_method,
      
      vehicle_name: `${selectedVehicle.brand} ${selectedVehicle.model}`
    };

    console.log("Data dioper ke halaman pembayaran:", bookingData);

    navigate('/payment', { state: bookingData });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Memuat data formulir...</div>;
  if (!selectedVehicle) return <div style={{ textAlign: 'center', padding: '100px' }}>Kendaraan tidak ditemukan.</div>;

  return (
    <main className={styles.bookingPage}>
      <section className="container">
        <div className={styles.headerBlock}>
          <div>
            <span className={styles.eyebrow}>Booking Kendaraan</span>
            <h1>Lengkapi detail sewa, armada siap kami jadwalkan.</h1>
            <p>Form booking dibuat untuk data rental kendaraan: jadwal, lokasi pickup, opsi driver, dan ringkasan pembayaran.</p>
          </div>
          <Link to="/#katalog" className={styles.backLink}>Kembali ke katalog</Link>
        </div>

        <div className={styles.bookingGrid}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            
            <div className={styles.formSection}>
              <div className={styles.sectionTitle}><CarFront size={19} /> Pilih Kendaraan</div>
              <select 
                value={selectedVehicleId} 
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                required
              >
                {vehicles.filter(v => v.status === 'tersedia' || v.status === 'available').map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} — {formatPrice(vehicle.price_per_day || vehicle.price)}/hari
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}><CalendarDays size={19} /> Jadwal Sewa</div>
              <div className={styles.twoCol}>
                <label>Tanggal Mulai
                  <input 
                    type="date" 
                    name="start_date" 
                    value={formData.start_date} 
                    onChange={handleInputChange} 
                    required 
                  />
                </label>
                <label>Jam Pickup
                  <input 
                    type="time" 
                    name="pickup_time" 
                    value={formData.pickup_time} 
                    onChange={handleInputChange} 
                    required 
                  />
                </label>
              </div>
              <div className={styles.durationRow}>
                {[1, 2, 3, 7].map((day) => (
                  <button 
                    type="button" 
                    key={day} 
                    onClick={() => setDuration(day)} 
                    className={duration === day ? styles.activeDuration : ''}
                  >
                    {day} hari
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}><MapPin size={19} /> Lokasi & Catatan</div>
              <label>Lokasi Pickup
                <textarea 
                  name="pickup_location" 
                  value={formData.pickup_location} 
                  onChange={handleInputChange} 
                  placeholder="Tulis alamat pickup atau titik temu..." 
                  rows={3} 
                  required
                />
              </label>
              <label>Catatan Tambahan (Opsional)
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange} 
                  placeholder="Contoh: butuh child seat, pickup di lobby, dll." 
                  rows={3} 
                />
              </label>
              <label className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={withDriver} 
                  onChange={(e) => setWithDriver(e.target.checked)} 
                /> 
                Tambahkan driver profesional (+Rp250.000/hari)
              </label>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}><CreditCard size={19} /> Metode Pembayaran</div>
              <select 
                name="payment_method" 
                value={formData.payment_method} 
                onChange={handleInputChange}
                required
              >
                <option value="transfer">Transfer Bank (Verifikasi Manual)</option>
                <option value="qris">QRIS / E-Wallet</option>
                <option value="cash">Cash on Delivery (Bayar saat pickup)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-solid btn-block">Lanjutkan Pembayaran</button>
          </form>

          <aside className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <span>Ringkasan Transaksi</span>
              <ShieldCheck size={20} />
            </div>
            <div className={styles.vehicleBox}>
              <div className={styles.vehicleIcon}><CarFront size={28} /></div>
              <div>
                <strong>{selectedVehicle.brand} {selectedVehicle.model}</strong>
                <span>{selectedVehicle.license_plate || selectedVehicle.plate}</span>
              </div>
            </div>
            <div className={styles.specList}>
              <div><UserRound size={16} /><span>{selectedVehicle.seat_capacity || 5} kursi</span></div>
              <div><Fuel size={16} /><span>{selectedVehicle.fuel_type || 'Bensin'}</span></div>
              <div><Clock3 size={16} /><span>{selectedVehicle.transmission || 'Manual'}</span></div>
            </div>
            <div className={styles.costRows}>
              <div><span>Harga harian</span><strong>{formatPrice(selectedVehicle.price_per_day || selectedVehicle.price)}</strong></div>
              <div><span>Durasi</span><strong>{duration} hari</strong></div>
              <div><span>Sewa Driver</span><strong>{withDriver ? formatPrice(250000 * duration) : 'Tidak'}</strong></div>
            </div>
            <div className={styles.totalRow}>
              <span>Estimasi Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className={styles.notice}><CheckCircle2 size={18} /> Admin akan konfirmasi ketersediaan dan dokumen via WhatsApp.</div>
            <div className={styles.paymentHint}><CreditCard size={18} /> Pembayaran sesuai dengan metode yang Anda pilih di form.</div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default BookingPage;