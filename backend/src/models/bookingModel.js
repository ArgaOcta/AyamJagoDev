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
    const query = `SELECT price_per_day FROM vehicles WHERE id = ?`;
    const [rows] = await db.query(query, [vehicleId]);
    return rows;
};

module.exports = {
    createBookingQuery,
    createPaymentQuery,
    getVehiclePriceQuery
};