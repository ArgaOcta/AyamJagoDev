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
    const query = `SELECT price_per_day, status FROM vehicles WHERE id = ?`;
    const [rows] = await db.query(query, [vehicleId]);
    return rows;
};

const updateVehicleStatus = async (vehicleId, status) => {
    const query = `UPDATE vehicles SET status = ? WHERE id = ?`;
    const [result] = await db.query(query, [status, vehicleId]);
    return result;
};

const getAllBookingsQuery = async () => {
    const query = `
        SELECT
            b.id,
            u.full_name AS user_name,
            v.brand,
            v.model,
            v.license_plate,
            b.start_date,
            b.end_date,
            b.total_days,
            b.total_price,
            b.booking_status,
            b.created_at
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

module.exports = {
    createBookingQuery,
    createPaymentQuery,
    getVehiclePriceQuery,
    updateVehicleStatus,
    getAllBookingsQuery
};