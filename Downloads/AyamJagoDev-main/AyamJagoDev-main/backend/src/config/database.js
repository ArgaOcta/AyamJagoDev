const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rental_kendaraan',
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

        try {
            await connection.query('ALTER TABLE users ADD COLUMN is_blocked TINYINT(1) DEFAULT 0');
            console.log('Kolom is_blocked ditambahkan ke tabel users.');
        } catch (alterError) {
            if (alterError.message && alterError.message.includes('Duplicate column name')) {
                // Kolom sudah ada, tidak perlu tindakan lebih lanjut
            } else {
                console.error('Gagal menambahkan kolom is_blocked:', alterError.message);
            }
        }

        connection.release();
    })
    .catch((err) => {
        console.error('Gagal terhubung ke database:', err.message);
    });

module.exports = db;