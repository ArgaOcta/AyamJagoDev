//Authentication → siapa   (login) dan bisa apa!
const authorize = (roles) => {
    return (req, res, next) => {
        // ambil role dari token (req.user dari authMiddleware)
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Akses ditolak (Forbidden)'
            });
        }
        next();
    };
};

module.exports = authorize; 