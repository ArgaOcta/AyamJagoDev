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

const cancelBooking = async (req, res) => {
    try {

        const { id } = req.params;

        const userId = req.user.id;

        await bookingModel.cancelBookingQuery(
            id,
            userId
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking tidak ditemukan atau tidak bisa dibatalkan'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Booking berhasil dibatalkan'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

const updateBooking = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            vehicle_id,
            start_date,
            end_date
        } = req.body;

        if (
            !vehicle_id ||
            !start_date ||
            !end_date
        ) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap'
            });
        }

        const vehicle =
            await bookingModel.getVehiclePriceQuery(
                vehicle_id
            );

        if (vehicle.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kendaraan tidak ditemukan'
            });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);

        const totalDays = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        if (totalDays <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Tanggal tidak valid'
            });
        }

        const totalPrice =
            totalDays *
            vehicle[0].price_per_day;

        const result =
            await bookingModel.updateBookingQuery(
                id,
                vehicle_id,
                start_date,
                end_date,
                totalDays,
                totalPrice
            );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking tidak ditemukan atau sudah diproses'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Booking berhasil diperbarui'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

const getBookingById = async (req, res) => {

    try {

        const { id } = req.params;

        const booking =
            await bookingModel.getBookingByIdQuery(id);

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking tidak ditemukan'
            });
        }

        return res.status(200).json({
            success: true,
            data: booking[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    processBooking,
    cancelBooking,
    updateBooking,
    getBookingById
};