const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// ✅ Save message and update chat
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const senderId = new mongoose.Types.ObjectId(sender);
    const receiverId = new mongoose.Types.ObjectId(receiver);

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: 'Invalid sender or receiver ID' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();

    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (existingChat) {
      existingChat.lastMessage = {
        content,
        timestamp: new Date()
      };
      existingChat.unreadBy = [receiverId]; // ✅ Mark receiver as unread
      await existingChat.save();
    } else {
      const newChat = new Chat({
        participants: [senderId, receiverId],
        lastMessage: {
          content,
          timestamp: new Date()
        },
        unreadBy: [receiverId] // ✅ Mark receiver as unread
      });
      await newChat.save();
    }

    res.status(201).json(message);
  } catch (err) {
    console.error('❌ Message save failed:', err.message);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ✅ Get messages between two users
router.get('/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    // ✅ Clear unread status for user
    await Chat.updateOne(
      { participants: { $all: [userId, partnerId] } },
      { $pull: { unreadBy: new mongoose.Types.ObjectId(userId) } }
    );

    res.json(messages);
  } catch (err) {
    console.error('❌ Failed to fetch messages:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;