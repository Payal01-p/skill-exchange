const SkillPost = require('../models/SkillPost');
const mongoose = require('mongoose');

// 🔐 Get posts created by the logged-in user
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await SkillPost.find({ postedBy: req.user._id })
      .populate('postedBy', 'name email location')
      .populate('comments.postedBy', 'name email');
    res.json(posts);
  } catch (error) {
    console.error('❌ Error in getMyPosts:', error.message);
    res.status(500).json({ error: 'Failed to fetch your posts' });
  }
};

// ✅ Create a new skill post
exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const post = await SkillPost.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.json(post);
  } catch (error) {
    console.error('❌ Error in createPost:', error.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// 🌐 Get skill posts with optional filters and pagination
exports.getPosts = async (req, res) => {
  try {
    const { category, type, location, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = location;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await SkillPost.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('postedBy', 'name email location')
      .populate('comments.postedBy', 'name email')
      .lean();

    res.json(posts);
  } catch (error) {
    console.error('❌ Error in getPosts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// 💬 Add a comment to a skill post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await SkillPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Skill post not found' });
    }

    post.comments.push({
      text,
      postedBy: req.user._id,
      createdAt: new Date(),
    });

    await post.save();

    const updatedPost = await SkillPost.findById(post._id)
      .populate('postedBy', 'name email location')
      .populate('comments.postedBy', 'name email');

    res.json(updatedPost);
  } catch (error) {
    console.error('❌ Error in addComment:', error.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// 📄 Get single post
exports.getSinglePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const post = await SkillPost.findById(id)
      .populate('postedBy', 'name email location')
      .populate('comments.postedBy', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('❌ Error in getSinglePost:', error.message);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
};

// ✏️ Update post
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

    const allowedFields = ['title', 'description', 'category', 'location', 'type'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    console.error('❌ Error in updatePost:', error.message);
    res.status(500).json({ message: 'Server error while updating post' });
  }
};

// 🗑️ Delete post
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

    await SkillPost.deleteOne({ _id: id });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('❌ Error in deletePost:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🙈 Hide post
exports.hidePost = async (req, res) => {
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

    post.hidden = true;
    await post.save();
    res.json({ message: 'Post hidden successfully' });
  } catch (error) {
    console.error('❌ Error in hidePost:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};