import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { NotFoundError } from '../utils/errors.js';
import userDAO from '../dao/UserDAO.js';
import postService from '../services/PostService.js';

const router = express.Router();

// Get user profile
router.get(
  '/:username',
  asyncHandler((req, res) => {
    const user = userDAO.findByUsername(req.params.username);

    if (!user) {
      throw new NotFoundError('User');
    }

    res.status(200).json(userDAO.formatUser(user));
  }),
);

// Get user posts (by username)
router.get(
  '/:username/posts',
  asyncHandler((req, res) => {
    const user = userDAO.findByUsername(req.params.username);

    if (!user) {
      throw new NotFoundError('User');
    }

    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const offset = parseInt(req.query.offset || '0', 10);

    const posts = postService.getUserPosts(user.id, limit, offset);

    res.status(200).json({
      posts,
      limit,
      offset,
    });
  }),
);

export default router;
