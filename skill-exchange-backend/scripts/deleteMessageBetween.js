const mongoose = require('mongoose');
const Message = require('../models/Message'); // Adjust path if needed
const User = require('../models/User');       // Adjust path if needed

const MONGO_URI = 'mongodb://localhost:27017/skillExchange'; // Update if needed

const deleteMessagesBetween = async (emailA, emailB) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const [userA, userB] = await Promise.all([
      User.findOne({ email: emailA }),
      User.findOne({ email: emailB }),
    ]);

    if (!userA || !userB) {
      console.log('❌ One or both users not found');
      return;
    }

    const result = await Message.deleteMany({
      $or: [
        { sender: userA._id, receiver: userB._id },
        { sender: userB._id, receiver: userA._id },
      ],
    });

    console.log(`🗑️ Deleted ${result.deletedCount} message(s) between ${emailA} and ${emailB}`);
  } catch (error) {
    console.error('❌ Error deleting messages:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

deleteMessagesBetween('payalprajapati@gmail.com', 'rahiljamadar87@gmail.com');