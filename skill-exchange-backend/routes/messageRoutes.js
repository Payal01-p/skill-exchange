// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, getNotifications, markAsRead } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth, sendMessage);
router.get('/notifications', auth, getNotifications);
router.put('/read/:id', auth, markAsRead);

module.exports = router;