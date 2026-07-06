const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Endpoint 1 : POST /auth/register ==========
router.post('/register', register);

// Endpoint 2 : POST /auth/login =========
router.post('/login', login);

module.exports = router;