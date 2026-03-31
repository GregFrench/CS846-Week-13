import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCreateReply } from '../utils/validators.js';
import { ValidationError } from '../utils/errors.js';
import replyService from '../services/ReplyService.js';

const router = express.Router({ mergeParams: true });

// Get post replies
router.get(
  '/',
  asyncHandler((req, res) => {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const offset = parseInt(req.query.offset || '0', 10);

    const replies = replyService.getPostReplies(req.params.postId, limit, offset);

    res.status(200).json({
      replies,
      limit,
      offset,
    });
  }),
);

// Create reply
router.post(
  '/',
  authenticateToken,
  asyncHandler((req, res) => {
    const { error, value } = validateCreateReply(req.body);

    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(', '));
    }

    const reply = replyService.createReply(req.params.postId, req.userId, value.content);

    res.status(201).json({ reply });
  }),
);

export default router;
