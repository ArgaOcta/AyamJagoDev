const express = require('express');
require('dotenv').config();
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Endpoint sederhana sesuai target Sprint
app.get('/', (req, res) => {
    res.json({
        message: "Backend Aplikasi Rental Kendaraan Berhasil Dijalankan!",
        status: "Success"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});