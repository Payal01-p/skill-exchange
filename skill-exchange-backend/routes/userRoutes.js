const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ Add auth middleware

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe); // 🆕 Authenticated route to get current user

module.exports = router;