const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ TAMBAHAN PENTING UNTUK MULTER (INI WAJIB)
app.use('/uploads', express.static('uploads'));

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Security middleware
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// CORS restricted
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

app.use(cookieParser());
app.use(express.json());


app.use('/uploads', express.static('uploads'));

// ROUTES
const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api/bookings', bookingRoutes);

console.log('Booking route loaded');
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// HOME
app.get('/', (req, res) => {
    res.json({
        message: "Backend Aplikasi Rental Kendaraan Berhasil Dijalankan!",
        status: "Success"
    });
});

// ADMIN
app.use('/api/admin', adminRoutes);

// ERROR HANDLER
app.use(errorHandler);

// START SERVER (TETAP PAKAI PUNYAMU, TIDAK AKU UBAH)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});