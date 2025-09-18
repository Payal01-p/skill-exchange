const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  addComment,
  hidePost // ✅ Add this
} = require('../controllers/skillController');
const auth = require('../middleware/auth');

// 🌐 Public fetch
router.get('/', getPosts);
router.get('/:id', getSinglePost); // 🕵️‍♂️ Get single post

// 🔐 Authenticated actions
router.post('/', auth, createPost);               // Create post
router.put('/:id', auth, updatePost);             // Update post
router.delete('/:id', auth, deletePost);          // Delete post
router.post('/:id/comment', auth, addComment);    // Add comment
router.put('/hide', auth, hidePost);

module.exports = router;