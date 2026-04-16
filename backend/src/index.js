const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "Backend Aplikasi Rental Kendaraan Berhasil Dijalankan!",
        status: "Success"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});