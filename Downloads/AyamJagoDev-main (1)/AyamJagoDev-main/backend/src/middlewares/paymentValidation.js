const validatePayment = (req, res, next) => {
    const { booking_id, payment_method, amount } = req.body;
    let errors = [];

    if (!booking_id || isNaN(booking_id)) {
        errors.push("Booking ID tidak valid");
    }

    if (!payment_method) {
        errors.push("Metode pembayaran wajib diisi");
    }

    if (!amount || isNaN(amount)) {
        errors.push("Jumlah pembayaran harus angka");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = { validatePayment };