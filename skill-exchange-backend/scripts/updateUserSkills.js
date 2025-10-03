const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/skillExchange');

(async () => {
  try {
    const newUser = new User({
      name: 'Test Match',
      email: 'test@gmail.com',
      password: 'test111', // use bcrypt if logging in
      skillsOffered: ['MongoDB', 'Express'],
      skillsNeeded: ['React'],
      location: 'Goa',
      rating: 4.7
    });

    await newUser.save();
    console.log('✅ Matching user inserted');
  } catch (err) {
    console.error('❌ Insert failed:', err.message);
  } finally {
    mongoose.disconnect();
  }
})();