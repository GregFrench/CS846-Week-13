import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCreatePost } from '../utils/validators.js';
import { ValidationError } from '../utils/errors.js';
import postService from '../services/PostService.js';
import userDAO from '../dao/UserDAO.js';

const router = express.Router();

// Get feed
router.get(
  '/',
  asyncHandler((req, res) => {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const offset = parseInt(req.query.offset || '0', 10);

    const posts = postService.getFeed(limit, offset);

    res.status(200).json({
      posts,
      limit,
      offset,
    });
  }),
);

// Create post
router.post(
  '/',
  authenticateToken,
  asyncHandler((req, res) => {
    const { error, value } = validateCreatePost(req.body);

    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(', '));
    }

    const post = postService.createPost(req.userId, value.content);

    res.status(201).json({ post });
  }),
);

// Get single post
router.get(
  '/:postId',
  asyncHandler((req, res) => {
    const post = postService.getPost(req.params.postId);
    res.status(200).json({ post });
  }),
);

// Get user posts
router.get(
  '/user/:userId',
  asyncHandler((req, res) => {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const offset = parseInt(req.query.offset || '0', 10);

    const posts = postService.getUserPosts(req.params.userId, limit, offset);

    res.status(200).json({
      posts,
      limit,
      offset,
    });
  }),
);

export default router;
