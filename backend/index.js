const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config();
require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// --- MIDDLEWARES ---
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Helmet mengizinkan browser membaca gambar (Penting!)
app.use(helmet({ crossOriginResourcePolicy: false }));

//app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- STATIC FOLDER ---
// Karena index.js ada di root, __dirname langsung mengarah ke root project
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// --- ROUTES IMPORT ---
const bookingRoutes = require('./src/routes/bookingRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes'); 
const paymentRoutes = require('./src/routes/paymentRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// --- USE ROUTES ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- ROOT ENDPOINT ---
app.get('/', (req, res) => {
    res.json({
        message: "Backend Aplikasi Rental Kendaraan Berhasil Dijalankan!",
        status: "Success"
    });
});

// --- ERROR HANDLER ---
app.use(errorHandler);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});