import replyDAO from '../dao/ReplyDAO.js';
import postDAO from '../dao/PostDAO.js';
import userDAO from '../dao/UserDAO.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../logger.js';

export class ReplyService {
  createReply(postId, userId, content) {
    try {
      const post = postDAO.findById(postId);
      if (!post) {
        throw new NotFoundError('Post');
      }

      const reply = replyDAO.create(postId, userId, content);
      postDAO.incrementReplyCount(postId);

      logger.info(`Reply created: ${reply.id} to post: ${postId}`);
      return this.enrichReply(reply);
    } catch (error) {
      logger.error(`ReplyService.createReply failed: ${error.message}`);
      throw error;
    }
  }

  getPostReplies(postId, limit = 50, offset = 0) {
    try {
      const post = postDAO.findById(postId);
      if (!post) {
        throw new NotFoundError('Post');
      }

      const replies = replyDAO.findByPostId(postId, limit, offset);
      return this.enrichRepliesBatch(replies);
    } catch (error) {
      logger.error(`ReplyService.getPostReplies failed: ${error.message}`);
      throw error;
    }
  }

  enrichRepliesBatch(replies) {
    try {
      // Get all unique user IDs
      const userIds = [...new Set(replies.map((r) => r.user_id))];

      // Create a map of user IDs to usernames
      const userMap = {};
      userIds.forEach((userId) => {
        const user = userDAO.findById(userId);
        userMap[userId] = user ? user.username : 'Unknown User';
      });

      // Enrich replies using the user map
      return replies.map((reply) => ({
        id: reply.id,
        user_id: reply.user_id,
        username: userMap[reply.user_id],
        post_id: reply.post_id,
        content: reply.content,
        created_at: reply.created_at,
      }));
    } catch (error) {
      logger.error(`ReplyService.enrichRepliesBatch failed: ${error.message}`);
      // Return replies without usernames if enrichment fails
      return replies.map((reply) => ({
        id: reply.id,
        user_id: reply.user_id,
        username: 'Unknown User',
        post_id: reply.post_id,
        content: reply.content,
        created_at: reply.created_at,
      }));
    }
  }
}

export default new ReplyService();
