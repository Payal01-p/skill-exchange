const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: {
    content: String,
    timestamp: Date,
  },
  unreadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // ✅ Track unread status
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);