// controllers/messageController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id, read: false })
      .populate('sender', 'name');
    res.json(messages);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to update message' });
  }
};