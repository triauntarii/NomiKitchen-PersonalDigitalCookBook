const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Endpoint: POST /auth/register
router.post('/register', register);

// Endpoint: POST /auth/login
router.post('/login', login);

module.exports = router;