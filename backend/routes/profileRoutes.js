const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(authMiddleware);

// Endpoint 3 : GET /profile  ==========
router.get('/', profileController.getProfile);

// Endpoint 4 : PUT /profile  ==========
router.put('/', upload.single('profilePic'), profileController.updateProfile);

module.exports = router;