const db = require('../config/database');

const createBookingQuery = async (userId, vehicleId, startDate, endDate, totalDays, totalPrice) => {

    const query = `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_days, total_price, booking_status) 
                   VALUES (?, ?, ?, ?, ?, ?, 'pending')`;
    const values = [userId, vehicleId, startDate, endDate, totalDays, totalPrice];
    
    const [result] = await db.query(query, values);
    return result.insertId; 
};

const createPaymentQuery = async (bookingId, paymentMethod, amount) => {
    const query = `INSERT INTO payments (booking_id, payment_method, amount, payment_status) 
                   VALUES (?, ?, ?, 'pending')`;
    const values = [bookingId, paymentMethod, amount];
    
    const [result] = await db.query(query, values);
    return result;
};

const getVehiclePriceQuery = async (vehicleId) => {
    // BUG FIX: Tambahkan pengambilan 'status' dari database
    const query = `SELECT price_per_day, status FROM vehicles WHERE id = ?`;
    const [rows] = await db.query(query, [vehicleId]);
    return rows;
};

const cancelBookingQuery = async (
    bookingId,
    userId
) => {

    const query = `
        UPDATE bookings
        SET booking_status='cancelled'
        WHERE id=?
        AND user_id=?
        AND booking_status='pending'
    `;

    const [result] =
        await db.query(query, [
            bookingId,
            userId
        ]);

    return result;
};

const updateBookingQuery = async (
    bookingId,
    vehicleId,
    startDate,
    endDate,
    totalDays,
    totalPrice
) => {

    const query = `
        UPDATE bookings
        SET vehicle_id = ?,
            start_date = ?,
            end_date = ?,
            total_days = ?,
            total_price = ?
        WHERE id = ?
        AND user_id=?
        AND booking_status = 'pending'
    `;

    const [result] = await db.query(
        query,
        [
            vehicleId,
            startDate,
            endDate,
            totalDays,
            totalPrice,
            bookingId
        ]
    );

    return result;
};

const getBookingByIdQuery = async (bookingId) => {

    const query = `
        SELECT *
        FROM bookings
        WHERE id = ?
    `;

    const [rows] = await db.query(query, [bookingId]);

    return rows;
};

module.exports = {
    createBookingQuery,
    createPaymentQuery,
    getVehiclePriceQuery,
    cancelBookingQuery,
    updateBookingQuery,
    getBookingByIdQuery
};