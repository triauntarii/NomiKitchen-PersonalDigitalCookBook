const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Tambah Resep Baru (POST /recipes)
exports.createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, categoryId } = req.body;
    const userId = req.user.id; // Didapat dari authMiddleware

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

        // Ambil kembali resep beserta fotonya untuk response
        const createdRecipe = await prisma.recipe.findUnique({
            where: { id: newRecipe.id },
            include: { photos: true }
        });

        res.status(201).json({ message: "Resep berhasil ditambahkan", recipe: createdRecipe });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// Lihat Seluruh Resep (GET /recipes)
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