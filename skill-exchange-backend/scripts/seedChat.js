const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const User = require('../models/User'); // adjust path if needed

mongoose.connect('mongodb://localhost:27017/skillExchange').then(async () => {
  try {
    // ✅ Find user IDs by email
    const user1 = await User.findOne({ email: 'rahiljamadar87@gmail.com' });
    const user2 = await User.findOne({ email: 'payalprajapati@gmail.com' });

    if (!user1 || !user2) {
      console.error('❌ One or both users not found');
      return mongoose.disconnect();
    }

    // ✅ Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [user1._id, user2._id] }
    });

    if (existingChat) {
      console.log('ℹ️ Chat already exists:', existingChat._id);
    } else {
      // ✅ Create new chat
      const newChat = new Chat({
        participants: [user1._id, user2._id],
        lastMessage: {
          content: 'Seeded message for testing',
          timestamp: new Date()
        }
      });

      await newChat.save();
      console.log('✅ Chat seeded successfully:', newChat._id);
    }
  } catch (err) {
    console.error('❌ Failed to seed chat:', err.message);
  } finally {
    mongoose.disconnect();
  }
});