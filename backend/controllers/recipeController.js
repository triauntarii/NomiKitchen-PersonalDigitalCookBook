const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// Function Tambah Resep Baru - (POST /recipes)
// ============================================================
exports.createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, categoryId } = req.body;
    const userId = req.user.id;

    try {
        // 1. Simpan data resep
        const newRecipe = await prisma.recipe.create({
            data: {
                title,
                description,
                ingredients,
                instructions,
                userId: userId,
                categoryId: categoryId ? parseInt(categoryId) : null,
            }
        });

        // 2. Jika ada file foto yang diunggah, simpan ke tabel RecipePhoto
        if (req.files && req.files.length > 0) {
            const photosData = req.files.map(file => ({
                url: file.filename,
                recipeId: newRecipe.id
            }));
            await prisma.recipePhoto.createMany({ data: photosData });
        }

        // 3. Ambil kembali resep beserta fotonya untuk response
        const createdRecipe = await prisma.recipe.findUnique({
            where: { id: newRecipe.id },
            include: { photos: true }
        });

        res.status(201).json({ message: "Resep berhasil ditambahkan", recipe: createdRecipe });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Melihat Seluruh Resep - (GET /recipes)
// ============================================================
exports.getAllRecipes = async (req, res) => {
    const userId = req.user.id; // Hanya ambil resep milik user yang sedang login

    try {
        const recipes = await prisma.recipe.findMany({
            where: { userId: userId },
            include: { photos: true, category: true },
            orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
        });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Lihat Detail Resep Berdasarkan ID - (GET /recipes/:id)
// ============================================================
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await prisma.recipe.findFirst({
            where: { id: parseInt(id), userId: req.user.id },
            include: { photos: true, category: true }
        });

        if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan" });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Update Informasi Resep - (PUT /recipes/:id)
// ============================================================
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions, categoryId } = req.body;

    try {
        // Cek kepemilikan resep
        const existingRecipe = await prisma.recipe.findUnique({ 
            where: { id: parseInt(id) }
        });
        
        if (!existingRecipe || existingRecipe.userId !== req.user.id) {
            return res.status(403).json({ message: "Anda tidak berhak mengubah resep ini" });
        }

        // Update data teks resep
        await prisma.recipe.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                ingredients,
                instructions,
                categoryId: categoryId ? parseInt(categoryId) : null,
            }
        });

        // Update foto (Jika ada file baru)
        if (req.files && req.files.length > 0) {
            // 1. Hapus referensi foto lama dari database
            await prisma.recipePhoto.deleteMany({
                where: { recipeId: parseInt(id) }
            });

            // 2. Siapkan data foto baru
            const photosData = req.files.map(file => ({
                url: file.filename,
                recipeId: parseInt(id)
            }));

            // 3. Simpan data foto baru ke database
            await prisma.recipePhoto.createMany({ data: photosData });
        }

        // Ambil kembali data resep terbaru beserta fotonya untuk dikembalikan sebagai response
        const finalRecipe = await prisma.recipe.findUnique({
            where: { id: parseInt(id) },
            include: { photos: true, category: true }
        });

        res.json({ message: "Resep berhasil diperbarui", recipe: finalRecipe });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Menghapus Resep - (DELETE /recipes/:id)
// ============================================================
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const existingRecipe = await prisma.recipe.findUnique({ where: { id: parseInt(id) } });
        if (!existingRecipe || existingRecipe.userId !== req.user.id) {
            return res.status(403).json({ message: "Anda tidak berhak menghapus resep ini" });
        }

        await prisma.recipe.delete({ where: { id: parseInt(id) } });
        res.status(204).send(); // 204 No Content sesuai proposal Anda
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Mengubah Status Favorit - (PATCH /recipes/:id/favorite)
// ============================================================
exports.toggleFavorite = async (req, res) => {
    const { id } = req.params;

    try {
        const existingRecipe = await prisma.recipe.findUnique({ where: { id: parseInt(id) } });
        if (!existingRecipe || existingRecipe.userId !== req.user.id) {
            return res.status(403).json({ message: "Akses ditolak" });
        }

        const updatedRecipe = await prisma.recipe.update({
            where: { id: parseInt(id) },
            data: { isFavorite: !existingRecipe.isFavorite } // Membalikkan nilai true/false
        });

        res.json({ message: "Status favorit diperbarui", isFavorite: updatedRecipe.isFavorite });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// ============================================================
// Function untuk Mencari Resep - (GET /recipes/search?keyword=&category=)
// ============================================================
exports.searchRecipes = async (req, res) => {
    const { keyword, category } = req.query;
    const userId = req.user.id;

    try {
        const recipes = await prisma.recipe.findMany({
            where: {
                userId: userId,
                // Mencari keyword di title ATAU description
                OR: [
                    { title: { contains: keyword || '' } },
                    { description: { contains: keyword || '' } }
                ],
                // Jika category dikirim, filter berdasarkan nama kategori
                ...(category && { category: { name: { equals: category } } })
            },
            include: { category: true, photos: true }
        });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};