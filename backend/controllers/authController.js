const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Fungsi untuk Register (Mendaftar) ======================================================
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }

        // 2. Hash password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Simpan user ke database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        res.status(201).json({ 
            message: "Registrasi berhasil!", 
            user: { id: newUser.id, name: newUser.name, email: newUser.email } 
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// Fungsi untuk Login (Masuk) =============================================================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cari user berdasarkan email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email tidak ditemukan!" });
        }

        // 2. Bandingkan password yang diinput dengan password di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah!" });
        }

        // 3. Buat JSON Web Token (JWT)
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ 
            message: "Login berhasil!", 
            token, 
            user: { id: user.id, name: user.name, email: user.email, profilePic: user.profilePic } 
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};