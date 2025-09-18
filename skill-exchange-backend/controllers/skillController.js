const SkillPost = require('../models/SkillPost');
const mongoose = require('mongoose');

// Create a new skill post
exports.createPost = async (req, res) => {
  try {
    const post = await SkillPost.create({
      ...req.body,
      postedBy: req.user.id,
    });
    res.json(post);
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get skill posts with optional filters
exports.getPosts = async (req, res) => {
  try {
    const { category, type, location } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = location;

    const posts = await SkillPost.find(filter)
      .populate('postedBy', 'name location')
      .populate('comments.postedBy', 'name');

    res.json(posts);
  } catch (error) {
    console.error('Error in getPosts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Add a comment to a skill post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await SkillPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Skill post not found' });
    }

    post.comments.push({
      text,
      postedBy: req.user.id,
    });

    await post.save();

    const updatedPost = await SkillPost.findById(post._id)
      .populate('postedBy', 'name location')
      .populate('comments.postedBy', 'name');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error in addComment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get single post
exports.getSinglePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const post = await SkillPost.findById(id)
      .populate('postedBy', 'name location')
      .populate('comments.postedBy', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error in getSinglePost:', error);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const post = await SkillPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!req.user || post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(post, req.body);
    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    console.error('Error in updatePost:', error);
    res.status(500).json({ message: 'Server error while updating post' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const post = await SkillPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in deletePost:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.hidePost = async (req, res) => {
  try {
    const post = await SkillPost.findOne({ postedBy: req.user._id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.hidden = true;
    await post.save();
    res.json({ message: 'Post hidden successfully' });
  } catch (error) {
    console.error('Error hiding post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};