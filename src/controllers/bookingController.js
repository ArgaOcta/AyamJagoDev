const bookingModel = require('../models/bookingModel');

const processBooking = async (req, res) => {
    const { user_id, vehicle_id, start_date, end_date, payment_method } = req.body;

    try {
        const vehicle = await bookingModel.getVehiclePriceQuery(vehicle_id);
        if (vehicle.length === 0) {
            return res.status(404).json({ success: false, message: "Kendaraan tidak ditemukan" });
        }
        const pricePerDay = vehicle[0].price_per_day;
        
        const start = new Date(start_date);1
        const end = new Date(end_date);
        const totalDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1; 

        const totalPrice = totalDays * pricePerDay;

        const newBookingId = await bookingModel.createBookingQuery(
            user_id, vehicle_id, start_date, end_date, totalDays, totalPrice
        );

        await bookingModel.createPaymentQuery(newBookingId, payment_method, totalPrice);

        res.status(201).json({
            success: true,
            message: "Pesanan berhasil dibuat! Menunggu konfirmasi admin.",
            data: { booking_id: newBookingId, total_days: totalDays, total_price: totalPrice }
        });

    } catch (error) {
        console.error("Error saat memproses booking:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server saat melakukan booking." });
    }
};

module.exports = { processBooking };