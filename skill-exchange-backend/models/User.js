const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 6 },
    location: { type: String, trim: true },
    skillsOffered: [{ type: String, trim: true }],
    skillsNeeded: [{ type: String, trim: true }],
    bio: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);