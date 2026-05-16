const bookingModel = require('../models/bookingModel');

const canonicalPaymentMethod = (method) => {
    const normalized = String(method || '').toLowerCase().trim();
    const map = {
        cash: 'cash',
        'cash on delivery': 'cash',
        cod: 'cash',
        transfer: 'transfer',
        'transfer bank': 'transfer',
        qris: 'qris',
        'e-wallet': 'qris',
        'ewallet': 'qris'
    };
    return map[normalized] || null;
};

const processBooking = async (req, res) => {
    const userId = req.user?.id;
    const { vehicle_id, start_date, end_date, payment_method } = req.body;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Autentikasi dibutuhkan' });
    }

    const canonicalPayment = canonicalPaymentMethod(payment_method);
    if (!canonicalPayment) {
        return res.status(400).json({
            success: false,
            message: 'Metode pembayaran tidak valid. Pilih cash, transfer, atau qris.'
        });
    }

    if (!vehicle_id || !start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: 'Validasi Gagal: vehicle_id, start_date, dan end_date wajib diisi.'
        });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            success: false,
            message: 'Validasi Gagal: Format tanggal tidak valid (gunakan YYYY-MM-DD).'
        });
    }

    if (start >= end) {
        return res.status(400).json({
            success: false,
            message: 'Validasi Gagal: Tanggal pengembalian harus lebih dari tanggal sewa.'
        });
    }

    try {
        const vehicle = await bookingModel.getVehiclePriceQuery(vehicle_id);
        if (vehicle.length === 0) {
            return res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan' });
        }

        if (vehicle[0].status !== 'tersedia') {
            return res.status(400).json({
                success: false,
                message: 'Mohon maaf, kendaraan ini sedang disewa atau dalam perbaikan.'
            });
        }

        const pricePerDay = vehicle[0].price_per_day;
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = totalDays * pricePerDay;

        const newBookingId = await bookingModel.createBookingQuery(
            userId,
            vehicle_id,
            start_date,
            end_date,
            totalDays,
            totalPrice
        );

        await bookingModel.createPaymentQuery(newBookingId, canonicalPayment, totalPrice);
        await bookingModel.updateVehicleStatus(vehicle_id, 'disewa');

        res.status(201).json({
            success: true,
            message: 'Pesanan berhasil dibuat! Menunggu konfirmasi admin.',
            data: { booking_id: newBookingId, total_days: totalDays, total_price: totalPrice }
        });
    } catch (error) {
        console.error('Error saat memproses booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: Terjadi kesalahan pada sistem saat memproses pesanan.',
            error_detail: error.message
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.getAllBookingsQuery();
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error mengambil semua booking:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data booking.' });
    }
};

module.exports = { processBooking, getAllBookings };