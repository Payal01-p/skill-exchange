// models/SkillPost.js
const mongoose = require('mongoose');

const skillPostSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  type: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [
    {
      text: String,
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  hidden: { type: Boolean, default: false } // ✅ New field
});

module.exports = mongoose.model('SkillPost', skillPostSchema);