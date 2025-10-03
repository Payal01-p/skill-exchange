const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ Protect sensitive routes

// 🔓 Public routes
router.post('/register', register); // Register new user
router.post('/login', login);       // Login and receive token

// 🔐 Protected route
router.get('/me', auth, getMe);     // Get current user info

module.exports = router;