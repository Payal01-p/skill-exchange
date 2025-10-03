const User = require('../models/User');

exports.getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skillsOffered: { $in: currentUser.skillsNeeded },
      skillsNeeded: { $in: currentUser.skillsOffered },
    }).select('name location skillsOffered skillsNeeded rating');

    res.json(matches);
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};