import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database.js';
import logger from '../logger.js';

export class PostDAO {
  findById(id) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM posts WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      logger.error(`PostDAO.findById failed: ${error.message}`);
      throw error;
    }
  }

  findByUserId(userId, limit = 50, offset = 0) {
    try {
      const stmt = getDatabase().prepare(
        'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      );
      return stmt.all(userId, limit, offset);
    } catch (error) {
      logger.error(`PostDAO.findByUserId failed: ${error.message}`);
      throw error;
    }
  }

  findAll(limit = 50, offset = 0) {
    try {
      const stmt = getDatabase().prepare(
        'SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      );
      return stmt.all(limit, offset);
    } catch (error) {
      logger.error(`PostDAO.findAll failed: ${error.message}`);
      throw error;
    }
  }

  create(userId, content) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const stmt = getDatabase().prepare(
        'INSERT INTO posts (id, user_id, content, like_count, reply_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      );

      stmt.run(id, userId, content, 0, 0, now, now);
      logger.info(`Post created: ${id}`);

      return { id, user_id: userId, content, like_count: 0, reply_count: 0, created_at: now };
    } catch (error) {
      logger.error(`PostDAO.create failed: ${error.message}`);
      throw error;
    }
  }

  incrementLikeCount(postId) {
    try {
      const stmt = getDatabase().prepare(
        'UPDATE posts SET like_count = like_count + 1 WHERE id = ?',
      );
      stmt.run(postId);
      logger.debug(`Like count incremented for post: ${postId}`);
    } catch (error) {
      logger.error(`PostDAO.incrementLikeCount failed: ${error.message}`);
      throw error;
    }
  }

  decrementLikeCount(postId) {
    try {
      const stmt = getDatabase().prepare(
        'UPDATE posts SET like_count = MAX(0, like_count - 1) WHERE id = ?',
      );
      stmt.run(postId);
      logger.debug(`Like count decremented for post: ${postId}`);
    } catch (error) {
      logger.error(`PostDAO.decrementLikeCount failed: ${error.message}`);
      throw error;
    }
  }

  incrementReplyCount(postId) {
    try {
      const stmt = getDatabase().prepare(
        'UPDATE posts SET reply_count = reply_count + 1 WHERE id = ?',
      );
      stmt.run(postId);
      logger.debug(`Reply count incremented for post: ${postId}`);
    } catch (error) {
      logger.error(`PostDAO.incrementReplyCount failed: ${error.message}`);
      throw error;
    }
  }

  decrementReplyCount(postId) {
    try {
      const stmt = getDatabase().prepare(
        'UPDATE posts SET reply_count = MAX(0, reply_count - 1) WHERE id = ?',
      );
      stmt.run(postId);
      logger.debug(`Reply count decremented for post: ${postId}`);
    } catch (error) {
      logger.error(`PostDAO.decrementReplyCount failed: ${error.message}`);
      throw error;
    }
  }
}

export default new PostDAO();
