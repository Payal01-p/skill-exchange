const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, location, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      location,
      bio,
    });

    const sanitized = user.toObject();
    delete sanitized.password;

    res.status(201).json({ user: sanitized });
  } catch (error) {
    console.error('❌ Error in register:', error.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login and return JWT + user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    const isValid = user && await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const sanitized = user.toObject();
    delete sanitized.password;

    res.status(200).json({ token, user: sanitized }); // ✅ Required by frontend
  } catch (error) {
    console.error('❌ Error in login:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('❌ Error in getMe:', error.message);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
};