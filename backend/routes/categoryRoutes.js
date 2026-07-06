const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Endpoint 3 : POST /categories ==========
router.post('/', categoryController.createCategory);

// Endpoint 4 : GET /categories ==========
router.get('/', categoryController.getAllCategories);

module.exports = router;