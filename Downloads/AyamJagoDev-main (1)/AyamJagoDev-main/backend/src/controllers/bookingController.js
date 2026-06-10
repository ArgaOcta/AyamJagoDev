const bookingModel = require('../models/bookingModel');

const processBooking = async (req, res) => {
    const { user_id, vehicle_id, start_date, end_date, payment_method } = req.body;

    const validMethods = ['cash', 'transfer', 'qris'];

    if (!payment_method) {
        return res.status(400).json({
            success: false,
            message: "Metode pembayaran wajib diisi!"
        });
    }

    if (!validMethods.includes(payment_method)) {
        return res.status(400).json({
            success: false,
            message: "Metode pembayaran tidak valid"
        });
    }
    if (!user_id || !vehicle_id || !start_date || !end_date || !payment_method) {
        return res.status(400).json({
            success: false,
            message: "Validasi Gagal: Semua data (user_id, vehicle_id, start_date, end_date, payment_method) wajib diisi!"
        });
    }
}

const normalizePaymentMethod = (method) => {
    const mapping = {
        'Transfer Bank': 'transfer',
        'Bank Transfer': 'transfer',
        transfer: 'transfer',
        'Cash on Delivery': 'cash',
        COD: 'cash',
        cash: 'cash',
        'E-Wallet': 'qris',
        qris: 'qris'
    };

    return mapping[method] || null;
};



module.exports = { processBooking };