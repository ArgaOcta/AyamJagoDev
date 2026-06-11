const bookingModel = require('../models/bookingModel');

const processBooking = async (req, res) => {
    try {
        const {
            user_id,
            vehicle_id,
            start_date,
            end_date,
            payment_method
        } = req.body;

        if (
            !user_id ||
            !vehicle_id ||
            !start_date ||
            !end_date ||
            !payment_method
        ) {
            return res.status(400).json({
                success: false,
                message: 'Semua data wajib diisi'
            });
        }

        // Ambil harga kendaraan
        const vehicleData =
            await bookingModel.getVehiclePriceQuery(vehicle_id);

        if (vehicleData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kendaraan tidak ditemukan'
            });
        }

        const vehicle = vehicleData[0];

        if (vehicle.status !== 'tersedia') {
            return res.status(400).json({
                success: false,
                message: 'Kendaraan sedang tidak tersedia'
            });
        }

        // Hitung jumlah hari
        const start = new Date(start_date);
        const end = new Date(end_date);

        const totalDays = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        if (totalDays <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Tanggal booking tidak valid'
            });
        }

        // Hitung total harga
        const totalPrice =
            totalDays * parseFloat(vehicle.price_per_day);

        // Simpan booking
        const bookingId =
            await bookingModel.createBookingQuery(
                user_id,
                vehicle_id,
                start_date,
                end_date,
                totalDays,
                totalPrice
            );

        // Simpan pembayaran
        await bookingModel.createPaymentQuery(
            bookingId,
            payment_method,
            totalPrice
        );

        return res.status(201).json({
            success: true,
            message: 'Booking berhasil dibuat',
            data: {
                booking_id: bookingId,
                user_id,
                vehicle_id,
                total_days: totalDays,
                total_price: totalPrice,
                payment_method
            }
        });

    } catch (error) {
        console.error('Booking Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

module.exports = {
    processBooking
};