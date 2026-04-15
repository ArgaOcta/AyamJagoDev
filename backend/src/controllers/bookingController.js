const bookingModel = require('../models/bookingModel');

const processBooking = async (req, res) => {
    const { user_id, vehicle_id, start_date, end_date, payment_method } = req.body;

    // ==========================================
    // 1. VALIDASI INPUT (Tugas Sprint 5)
    // ==========================================
    
    // Pengecekan field kosong (Required Format)
    if (!user_id || !vehicle_id || !start_date || !end_date || !payment_method) {
        return res.status(400).json({
            success: false,
            message: "Validasi Gagal: Semua data (user_id, vehicle_id, start_date, end_date, payment_method) wajib diisi!"
        });
    }

    // Validasi Tipe Data / Format Tanggal
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Validasi Gagal: Format tanggal tidak valid (gunakan YYYY-MM-DD)."
        });
    }

    // Validasi Logika: Tanggal kembali tidak boleh lebih kecil dari tanggal sewa
    if (start >= end) {
        return res.status(400).json({
            success: false,
            message: "Validasi Gagal: Tanggal pengembalian harus lebih dari tanggal sewa."
        });
    }

    // ==========================================
    // 2. ERROR HANDLING & TRY-CATCH
    // ==========================================
    try {
        const vehicle = await bookingModel.getVehiclePriceQuery(vehicle_id);
        
        if (vehicle.length === 0) {
            return res.status(404).json({ success: false, message: "Kendaraan tidak ditemukan" });
        }

        // BUG FIX SPRINT SEBELUMNYA: Tolak pesanan jika kendaraan tidak tersedia
        if (vehicle[0].status !== 'tersedia') {
            return res.status(400).json({ 
                success: false, 
                message: "Mohon maaf, kendaraan ini sedang disewa atau dalam perbaikan." 
            });
        }

        const pricePerDay = vehicle[0].price_per_day;
        const totalDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1; 
        const totalPrice = totalDays * pricePerDay;

        const newBookingId = await bookingModel.createBookingQuery(
            user_id, vehicle_id, start_date, end_date, totalDays, totalPrice
        );

        await bookingModel.createPaymentQuery(newBookingId, payment_method, totalPrice);

        // Menampilkan response konsisten (status code 201 Created)
        res.status(201).json({
            success: true,
            message: "Pesanan berhasil dibuat! Menunggu konfirmasi admin.",
            data: { booking_id: newBookingId, total_days: totalDays, total_price: totalPrice }
        });

    } catch (error) {
        console.error("Error saat memproses booking:", error);
        // Menampilkan response error yang jelas dari sistem (status code 500)
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error: Terjadi kesalahan pada sistem saat memproses pesanan.",
            error_detail: error.message 
        });
    }
};

module.exports = { processBooking };