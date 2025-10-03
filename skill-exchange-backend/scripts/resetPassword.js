const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User'); // adjust path

mongoose.connect('mongodb://localhost:27017/skillExchange').then(async () => {
  const email = 'payalprajapati@gmail.com';
  const newPassword = 'Payal@111';

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });

  console.log('✅ Password updated');
  mongoose.disconnect();
});