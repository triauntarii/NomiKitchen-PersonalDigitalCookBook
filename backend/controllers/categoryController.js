const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Tambah Kategori Baru (POST /categories)
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        // 1. CEK DULU SECARA MANUAL SEBELUM INSERT KE DATABASE
        const existingCategory = await prisma.category.findUnique({
            where: { name: name }
        });

        // 2. JIKA SUDAH ADA, LANGSUNG TOLAK (Tanpa menyentuh auto-increment)
        if (existingCategory) {
            return res.status(400).json({ message: "Nama kategori sudah ada!" });
        }

        // 3. JIKA BELUM ADA, BARU KITA SIMPAN
        const newCategory = await prisma.category.create({
            data: { name, description }
        });
        
        res.status(201).json({ message: "Kategori berhasil dibuat", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// Lihat Semua Kategori (GET /categories)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};