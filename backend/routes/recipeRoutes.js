const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(authMiddleware);

// Endpoint 7 : POST /recipes ==========
router.post('/', upload.array('photos', 5), recipeController.createRecipe);

// Endpoint 8 : GET /recipes ==========
router.get('/', recipeController.getAllRecipes);

// Endpoint 9 : GET /recipes/search ==========
router.get('/search', recipeController.searchRecipes);

// Endpoint 10 : GET /recipes/:id =========
router.get('/:id', recipeController.getRecipeById);

// Endpoint 11 : PUT /recipes/:id ==========
router.put('/:id', upload.array('photos', 5), recipeController.updateRecipe);

// Endpoint 12 : DELETE /recipes/:id =========
router.delete('/:id', recipeController.deleteRecipe);

// Endpoint 13 : PATCH /recipes/:id/favorite =========
router.patch('/:id/favorite', recipeController.toggleFavorite);

module.exports = router;