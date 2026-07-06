const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Mengambil token dari header Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan!" });

    const token = authHeader.split(' ')[1]; // Mengambil token setelah kata 'Bearer'
    if (!token) return res.status(401).json({ message: "Akses ditolak. Format token salah!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user (id) ke dalam req untuk dipakai di controller
        next(); // Lanjut ke fungsi controller
    } catch (error) {
        res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa!" });
    }
};

module.exports = authMiddleware;