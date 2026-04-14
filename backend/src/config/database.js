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

const db = pool.promise();

db.getConnection()
    .then(async (connection) => {
        console.log('Koneksi ke database MySQL berhasil!');
        
        try {
            // TEST QUERY: Melihat daftar tabel di dalam database rental_kendaraan
            const [rows] = await connection.query('SHOW TABLES');
            console.log('Test Query Berhasil! Berikut daftar tabel di database kamu:');
            console.log(rows);
        } catch (queryError) {
            console.error('Test Query Gagal:', queryError.message);
        }

        connection.release(); // Lepaskan koneksi setelah test selesai
    })
    .catch((err) => {
        console.error('Gagal terhubung ke database:', err.message);
    });

module.exports = db;