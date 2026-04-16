const express = require('express');
const cors = require('cors'); // 1. Import CORS
require('dotenv').config();
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Gunakan CORS agar React (port 5173) diizinkan mengambil data
app.use(cors()); 
app.use(express.json());

// 3. Import Routes
const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes'); // Pastikan ini ada
const historyRoutes = require('./routes/historyRoutes');

// 4. Gunakan Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes); // Daftarkan API kendaraan
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "Backend Aplikasi Rental Kendaraan Berhasil Dijalankan!",
        status: "Success"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});