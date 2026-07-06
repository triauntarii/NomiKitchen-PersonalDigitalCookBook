const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// ============================================================
// Function untuk Melihat Profil - (GET /profile)
// ============================================================
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                profilePic: true,
                createdAt: true,
                updatedAt: true
                // Password TIDAK di-select demi keamanan
            }
        });

        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Update Profil - (PUT /profile)
// ============================================================
exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    let updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Jika user mengupload foto profil baru
    if (req.file) {
        updateData.profilePic = req.file.filename;
    }

    try {
        // Jika user ingin ganti password, kita hash dulu password barunya
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: { id: true, name: true, email: true, profilePic: true } // Jangan kembalikan password
        });

        res.json({ message: "Profil berhasil diperbarui", user: updatedUser });
    } catch (error) {
        // Handle jika email yang diupdate sudah dipakai orang lain
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Email sudah digunakan oleh akun lain!" });
        }
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};