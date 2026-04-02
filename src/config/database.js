const mysql = require('mysql2');
require('dotenv').config();

// Membuat Connection Pool sesuai standar laporan
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mengubah pool menjadi format promise agar mudah digunakan dengan async/await
const db = pool.promise();

// Test koneksi
db.getConnection()
    .then((connection) => {
        console.log('Koneksi ke database MySQL berhasil!');
        connection.release();
    })
    .catch((err) => {
        console.error('Gagal terhubung ke database:', err.message);
    });

module.exports = db;