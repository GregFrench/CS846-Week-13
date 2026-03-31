import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database.js';
import logger from '../logger.js';

export class ReplyDAO {
  findById(id) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM replies WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      logger.error(`ReplyDAO.findById failed: ${error.message}`);
      throw error;
    }
  }

  findByPostId(postId, limit = 50, offset = 0) {
    try {
      const stmt = getDatabase().prepare(
        'SELECT * FROM replies WHERE post_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      );
      return stmt.all(postId, limit, offset);
    } catch (error) {
      logger.error(`ReplyDAO.findByPostId failed: ${error.message}`);
      throw error;
    }
  }

  findByUserId(userId, limit = 50, offset = 0) {
    try {
      const stmt = getDatabase().prepare(
        'SELECT * FROM replies WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      );
      return stmt.all(userId, limit, offset);
    } catch (error) {
      logger.error(`ReplyDAO.findByUserId failed: ${error.message}`);
      throw error;
    }
  }

  create(postId, userId, content) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const stmt = getDatabase().prepare(
        'INSERT INTO replies (id, user_id, post_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      );

      stmt.run(id, userId, postId, content, now, now);
      logger.info(`Reply created: ${id}`);

      return {
        id,
        user_id: userId,
        post_id: postId,
        content,
        created_at: now,
      };
    } catch (error) {
      logger.error(`ReplyDAO.create failed: ${error.message}`);
      throw error;
    }
  }

  countByPostId(postId) {
    try {
      const stmt = getDatabase().prepare('SELECT COUNT(*) as count FROM replies WHERE post_id = ?');
      const result = stmt.get(postId);
      return result.count;
    } catch (error) {
      logger.error(`ReplyDAO.countByPostId failed: ${error.message}`);
      throw error;
    }
  }
}

export default new ReplyDAO();
