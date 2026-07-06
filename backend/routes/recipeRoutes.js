const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Gunakan authMiddleware untuk semua route di bawah ini
router.use(authMiddleware);

// Endpoint: POST /recipes (Mendukung upload maksimal 5 foto)
router.post('/', upload.array('photos', 5), recipeController.createRecipe);

// Endpoint: GET /recipes
router.get('/', recipeController.getAllRecipes);

module.exports = router;