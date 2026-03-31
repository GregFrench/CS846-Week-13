import likeDAO from '../dao/LikeDAO.js';
import postDAO from '../dao/PostDAO.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import logger from '../logger.js';

export class LikeService {
  likePost(postId, userId) {
    try {
      const post = postDAO.findById(postId);
      if (!post) {
        throw new NotFoundError('Post');
      }

      const existingLike = likeDAO.findByPostAndUser(postId, userId);
      if (existingLike) {
        throw new ConflictError('Like');
      }

      const like = likeDAO.create(postId, userId);
      postDAO.incrementLikeCount(postId);

      logger.info(`Post liked: ${postId} by ${userId}`);
      return like;
    } catch (error) {
      logger.error(`LikeService.likePost failed: ${error.message}`);
      throw error;
    }
  }

  unlikePost(postId, userId) {
    try {
      const post = postDAO.findById(postId);
      if (!post) {
        throw new NotFoundError('Post');
      }

      const deleted = likeDAO.delete(postId, userId);
      if (deleted) {
        postDAO.decrementLikeCount(postId);
      }

      logger.info(`Post unliked: ${postId} by ${userId}`);
      return { success: deleted };
    } catch (error) {
      logger.error(`LikeService.unlikePost failed: ${error.message}`);
      throw error;
    }
  }

  isPostLikedByUser(postId, userId) {
    try {
      const like = likeDAO.findByPostAndUser(postId, userId);
      return !!like;
    } catch (error) {
      logger.error(`LikeService.isPostLikedByUser failed: ${error.message}`);
      throw error;
    }
  }
}

export default new LikeService();
