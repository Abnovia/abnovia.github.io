const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const BlogPost = require('../models/BlogPost');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/* GET all posts - API endpoint */
router.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1 });
    res.json({ posts });
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

/* POST new blog post - Protected with JWT */
router.post(
  '/post',
  verifyToken,
  [
    check('title').trim().isLength({ min: 1 }).escape(),
    check('content').trim().isLength({ min: 1 }),
    check('author').trim().isLength({ min: 1 }).escape(),
  ],
  async (req, res) => {
    try {
      console.log('Received post request with body:', req.body);

      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        console.error(
          'Database connection is not ready. Current state:',
          mongoose.connection.readyState
        );
        return res.status(503).json({
          error: 'Database connection is not available',
          details: 'Please try again later',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
          error: 'Please check your input and try again.',
          details: errors.array(),
        });
      }

      // Ensure tags is an array
      const tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags
        ? req.body.tags.split(',').map((tag) => tag.trim())
        : [];

      const postData = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        tags: tags,
        date: new Date(),
      };

      console.log('Creating post with data:', postData);
      const post = new BlogPost(postData);

      console.log('Attempting to save post...');
      const savedPost = await post.save();
      console.log('Post saved successfully:', savedPost);

      res.status(201).json({
        message: 'Post created successfully',
        post: savedPost,
      });
    } catch (error) {
      console.error('Detailed error creating post:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        readyState: mongoose.connection.readyState,
      });

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Invalid post data',
          details: error.message,
        });
      }

      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          error: 'Database connection is not available',
          details: 'Please try again later',
        });
      }

      res.status(500).json({
        error: 'Failed to create post. Please try again.',
        details: error.message,
      });
    }
  }
);

/* DELETE blog post - Protected with JWT */
router.delete('/post/:id', verifyToken, async (req, res) => {
  try {
    console.log('Delete request received:', {
      id: req.params.id,
      user: req.user.username,
      method: req.method,
      url: req.url,
    });

    // Check if post exists before trying to delete
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      console.log('Post not found:', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete the post
    await post.deleteOne();
    console.log('Post deleted successfully:', post._id);

    res.json({
      message: 'Post deleted successfully',
      postId: post._id,
    });
  } catch (error) {
    console.error('Error deleting post:', {
      message: error.message,
      stack: error.stack,
      postId: req.params.id,
    });

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    res.status(500).json({
      error: 'Failed to delete post',
      details: error.message,
    });
  }
});

/* PUT update blog post - Protected with JWT */
router.put(
  '/post/:id',
  verifyToken,
  [
    check('title').trim().isLength({ min: 1 }).escape(),
    check('content').trim().isLength({ min: 1 }),
    check('author').trim().isLength({ min: 1 }).escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Please check your input and try again.' });
      }

      const tags = req.body.tags
        ? req.body.tags.split(',').map((tag) => tag.trim())
        : [];

      const post = await BlogPost.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          content: req.body.content,
          author: req.body.author,
          tags: tags,
        },
        { new: true }
      );

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  }
);

module.exports = router;
