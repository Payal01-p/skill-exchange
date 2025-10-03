const mongoose = require('mongoose');
const Chat = require('../models/Chat'); // Adjust path if needed
const User = require('../models/User'); // Adjust path if needed

const MONGO_URI = 'mongodb://localhost:27017/skillExchange'; // Update if different

const deleteChatsByEmail = async (email) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return;
    }

    const result = await Chat.deleteMany({ participants: user._id });
    console.log(`🗑️ Deleted ${result.deletedCount} chat(s) for ${email}`);
  } catch (error) {
    console.error('❌ Error deleting chats:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

deleteChatsByEmail('payalprajapati@gmail.com');