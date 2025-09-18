// routes/meRoutes.js
const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth, getMe); // GET /api/me

module.exports = router;