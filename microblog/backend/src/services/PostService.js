import postDAO from '../dao/PostDAO.js';
import likeDAO from '../dao/LikeDAO.js';
import userDAO from '../dao/UserDAO.js';
import replyDAO from '../dao/ReplyDAO.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../logger.js';

export class PostService {
  createPost(userId, content) {
    try {
      const post = postDAO.create(userId, content);
      logger.info(`Post created by user: ${userId}`);
      return this.enrichPost(post);
    } catch (error) {
      logger.error(`PostService.createPost failed: ${error.message}`);
      throw error;
    }
  }

  getPost(postId) {
    try {
      const post = postDAO.findById(postId);
      if (!post) {
        throw new NotFoundError('Post');
      }
      return this.enrichPost(post);
    } catch (error) {
      logger.error(`PostService.getPost failed: ${error.message}`);
      throw error;
    }
  }

  getFeed(limit = 50, offset = 0) {
    try {
      const posts = postDAO.findAll(limit, offset);
      return this.enrichPostsBatch(posts);
    } catch (error) {
      logger.error(`PostService.getFeed failed: ${error.message}`);
      throw error;
    }
  }

  getUserPosts(userId, limit = 50, offset = 0) {
    try {
      const user = userDAO.findById(userId);
      if (!user) {
        throw new NotFoundError('User');
      }

      const posts = postDAO.findByUserId(userId, limit, offset);
      return this.enrichPostsBatch(posts);
    } catch (error) {
      logger.error(`PostService.getUserPosts failed: ${error.message}`);
      throw error;
    }
  }

  enrichPostsBatch(posts) {
    try {
      // Get all unique user IDs
      const userIds = [...new Set(posts.map((p) => p.user_id))];

      // Create a map of user IDs to usernames
      const userMap = {};
      userIds.forEach((userId) => {
        const user = userDAO.findById(userId);
        userMap[userId] = user ? user.username : 'Unknown User';
      });

      // Enrich posts using the user map
      return posts.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        username: userMap[post.user_id],
        content: post.content,
        like_count: post.like_count,
        reply_count: post.reply_count,
        created_at: post.created_at,
      }));
    } catch (error) {
      logger.error(`PostService.enrichPostsBatch failed: ${error.message}`);
      // Return posts without usernames if enrichment fails
      return posts.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        username: 'Unknown User',
        content: post.content,
        like_count: post.like_count,
        reply_count: post.reply_count,
        created_at: post.created_at,
      }));
    }
  }

  enrichPost(post) {
    try {
      // Fetch username from user
      const user = userDAO.findById(post.user_id);
      const username = user ? user.username : 'Unknown User';

      return {
        id: post.id,
        user_id: post.user_id,
        username: username,
        content: post.content,
        like_count: post.like_count,
        reply_count: post.reply_count,
        created_at: post.created_at,
      };
    } catch (error) {
      logger.error(`PostService.enrichPost failed: ${error.message}`);
      // Return post with fallback username if enrichment fails
      return {
        id: post.id,
        user_id: post.user_id,
        username: 'Unknown User',
        content: post.content,
        like_count: post.like_count,
        reply_count: post.reply_count,
        created_at: post.created_at,
      };
    }
  }
}

export default new PostService();
