const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes'); // Pastikan ini ada
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); //login

app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes); // Daftarkan API kendaraan
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  //login

app.get('/', (req, res) => {
    res.json({
        message: "Backend Aplikasi Rental Kendaraan Berhasil Dijalankan!",
        status: "Success"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

 