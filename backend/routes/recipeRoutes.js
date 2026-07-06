const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Gunakan authMiddleware untuk semua route di bawah ini
router.use(authMiddleware);

// Endpoint 5 : POST /recipes (Mendukung upload maksimal 5 foto) ==========
router.post('/', upload.array('photos', 5), recipeController.createRecipe);

// Endpoint 6 : GET /recipes ==========
router.get('/', recipeController.getAllRecipes);

// Endpoint 7 : GET /recipes/search ==========
router.get('/search', recipeController.searchRecipes);

// Endpoint 8 : GET /recipes/:id =========
router.get('/:id', recipeController.getRecipeById);

// Endpoint 9 : PUT /recipes/:id ==========
router.put('/:id', upload.array('photos', 5), recipeController.updateRecipe);

// Endpoint 10 : DELETE /recipes/:id =========
router.delete('/:id', recipeController.deleteRecipe);

// Endpoint 11 : PATCH /recipes/:id/favorite =========
router.patch('/:id/favorite', recipeController.toggleFavorite);

module.exports = router;