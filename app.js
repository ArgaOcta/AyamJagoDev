const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

/* ================= DB ================= */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rental_kendaraan'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

/* ===================================================
   USERS CRUD
=================================================== */
app.post('/users', (req, res) => {
    const { full_name, email, password_hash, role } = req.body;
    const sql = "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [full_name, email, password_hash, role], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'User berhasil dibuat' });
    });
});

app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

/* ===================================================
   VEHICLES CRUD
=================================================== */
app.post('/vehicles', (req, res) => {
    const { brand, model, license_plate, category, price_per_day } = req.body;

    const sql = `INSERT INTO vehicles 
    (brand, model, license_plate, category, price_per_day) 
    VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [brand, model, license_plate, category, price_per_day], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Kendaraan ditambahkan' });
    });
});

app.get('/vehicles', (req, res) => {
    db.query("SELECT * FROM vehicles", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

/* ===================================================
   BOOKINGS (ADA LOGIC)
=================================================== */
app.post('/bookings', (req, res) => {
    const { user_id, vehicle_id, start_date, end_date } = req.body;

    // 1. Ambil harga kendaraan
    db.query("SELECT price_per_day, status FROM vehicles WHERE id=?", [vehicle_id], (err, vehicle) => {
        if (err) return res.status(500).send(err);
        if (vehicle.length === 0) return res.send("Kendaraan tidak ditemukan");

        if (vehicle[0].status !== 'tersedia') {
            return res.send("Kendaraan tidak tersedia");
        }

        const price = vehicle[0].price_per_day;

        // 2. Hitung hari
        const start = new Date(start_date);
        const end = new Date(end_date);
        const total_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const total_price = total_days * price;

        // 3. Insert booking
        const sql = `INSERT INTO bookings 
        (user_id, vehicle_id, start_date, end_date, total_days, total_price)
        VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [user_id, vehicle_id, start_date, end_date, total_days, total_price], (err) => {
            if (err) return res.status(500).send(err);

            // 4. Update status kendaraan
            db.query("UPDATE vehicles SET status='disewa' WHERE id=?", [vehicle_id]);

            res.send({
                message: 'Booking berhasil',
                total_days,
                total_price
            });
        });
    });
});

/* GET BOOKINGS (JOIN) */
app.get('/bookings', (req, res) => {
    const sql = `
    SELECT b.id, u.full_name, v.brand, v.model, b.start_date, b.end_date, b.total_price, b.booking_status
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

/* ===================================================
   PAYMENTS
=================================================== */
app.post('/payments', (req, res) => {
    const { booking_id, payment_method, amount } = req.body;

    const sql = "INSERT INTO payments (booking_id, payment_method, amount, payment_status) VALUES (?, ?, ?, 'success')";

    db.query(sql, [booking_id, payment_method, amount], (err) => {
        if (err) return res.status(500).send(err);

        // Update booking jadi paid
        db.query("UPDATE bookings SET booking_status='paid' WHERE id=?", [booking_id]);

        res.send({ message: 'Pembayaran berhasil' });
    });
});

app.get('/payments', (req, res) => {
    const sql = `
    SELECT p.id, u.full_name, p.amount, p.payment_status
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN users u ON b.user_id = u.id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

/* =================================================== */
app.listen(3000, () => {
    console.log("Server jalan di http://localhost:3000");
});