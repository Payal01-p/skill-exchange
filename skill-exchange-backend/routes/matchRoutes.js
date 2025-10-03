const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMatches } = require('../controllers/matchController');

router.get('/', auth, getMatches); // GET /api/match

module.exports = router;