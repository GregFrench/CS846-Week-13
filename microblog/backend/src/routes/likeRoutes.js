import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import likeService from '../services/LikeService.js';

const router = express.Router({ mergeParams: true });

// Like post
router.post(
  '/',
  authenticateToken,
  asyncHandler((req, res) => {
    const like = likeService.likePost(req.params.postId, req.userId);
    res.status(201).json({ like });
  }),
);

// Unlike post
router.delete(
  '/',
  authenticateToken,
  asyncHandler((req, res) => {
    const result = likeService.unlikePost(req.params.postId, req.userId);
    res.status(200).json(result);
  }),
);

export default router;
