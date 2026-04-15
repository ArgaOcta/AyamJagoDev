import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        payment_method: 'Transfer Bank'
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Memproses pesanan...');

        try {
            const response = await axios.post('http://localhost:5000/api/bookings', {
                user_id: 1,
                vehicle_id: vehicleId,
                start_date: formData.start_date,
                end_date: formData.end_date,
                payment_method: formData.payment_method
            });

            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/'); 
            }, 3000);

        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Terjadi kesalahan jaringan.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Form Sewa Kendaraan</h2>
            <p>ID Kendaraan yang dipilih: {vehicleId}</p>

            {message && <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#f0f8ff', border: '1px solid #007BFF' }}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Tanggal Sewa:</label><br />
                    <input type="date" name="start_date" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label>Tanggal Kembali:</label><br />
                    <input type="date" name="end_date" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label>Metode Pembayaran:</label><br />
                    <select name="payment_method" onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="Transfer Bank">Transfer Bank</option>
                        <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                        <option value="E-Wallet">E-Wallet</option>
                    </select>
                </div>
                
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Konfirmasi Booking
                </button>
                <button type="button" onClick={() => navigate('/')} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Batal
                </button>
            </form>
        </div>
    );
}

export default BookingPage;