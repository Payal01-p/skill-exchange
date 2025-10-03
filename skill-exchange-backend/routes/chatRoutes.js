const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const User = require('../models/User'); // ✅ Adjust path if needed

// ✅ Get chat list for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const chats = await Chat.find({ participants: new mongoose.Types.ObjectId(userId) })
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });

    const formatted = chats.map(chat => {
      const otherUser = chat.participants.find(p => p._id.toString() !== userId);
      const isUnread = chat.unreadBy?.some(id => id.toString() === userId);

      return {
        chatId: chat._id,
        user: otherUser || { name: 'Unknown', email: '' },
        lastMessage: chat.lastMessage?.content || '',
        timestamp: chat.lastMessage?.timestamp || chat.updatedAt,
        unread: isUnread || false // ✅ Include unread flag
      };
    });

    console.log('✅ Chats found:', formatted.length);
    res.json(formatted);
  } catch (err) {
    console.error('❌ Failed to fetch chat list:', err.message);
    res.status(500).json({ error: 'Failed to fetch chat list' });
  }
});

// ✅ Seed chat if not exists
router.post('/seed', async (req, res) => {
  try {
    const { initiatorEmail, targetEmail } = req.body;

    if (!initiatorEmail || !targetEmail) {
      return res.status(400).json({ error: 'Missing emails' });
    }

    const user1 = await User.findOne({ email: initiatorEmail });
    const user2 = await User.findOne({ email: targetEmail });

    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    const existingChat = await Chat.findOne({
      participants: { $all: [user1._id, user2._id] }
    });

    if (existingChat) {
      return res.status(200).json({ message: 'Chat already exists', chatId: existingChat._id });
    }

    const newChat = new Chat({
      participants: [user1._id, user2._id],
      lastMessage: {
        content: 'Connection initiated',
        timestamp: new Date()
      },
      unreadBy: [user2._id] // ✅ Mark target user as unread
    });

    await newChat.save();
    res.status(201).json({ message: 'Chat seeded successfully', chatId: newChat._id });
  } catch (err) {
    console.error('❌ Chat seeding failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;