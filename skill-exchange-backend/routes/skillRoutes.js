const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  addComment,
  hidePost,
  getMyPosts,
} = require('../controllers/skillController');
const auth = require('../middleware/auth');

// 🌐 Public routes
router.get('/mine', auth, getMyPosts);       // 🔐 Must come before /:id
router.get('/', getPosts);                   // Get all posts with filters
router.get('/:id', getSinglePost);           // Get single post by ID

// 🔐 Protected routes
router.post('/', auth, createPost);               // Create a new post
router.put('/:id', auth, updatePost);             // Update a post
router.delete('/:id', auth, deletePost);          // Delete a post
router.post('/:id/comment', auth, addComment);    // Add a comment
router.put('/:id/hide', auth, hidePost);          // Hide a post

module.exports = router;