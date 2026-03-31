import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database.js';
import logger from '../logger.js';

export class LikeDAO {
  findByPostAndUser(postId, userId) {
    try {
      const stmt = getDatabase().prepare(
        'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      );
      return stmt.get(postId, userId);
    } catch (error) {
      logger.error(`LikeDAO.findByPostAndUser failed: ${error.message}`);
      throw error;
    }
  }

  findByPost(postId) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM likes WHERE post_id = ?');
      return stmt.all(postId);
    } catch (error) {
      logger.error(`LikeDAO.findByPost failed: ${error.message}`);
      throw error;
    }
  }

  findByUser(userId) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM likes WHERE user_id = ?');
      return stmt.all(userId);
    } catch (error) {
      logger.error(`LikeDAO.findByUser failed: ${error.message}`);
      throw error;
    }
  }

  create(postId, userId) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const stmt = getDatabase().prepare(
        'INSERT INTO likes (id, user_id, post_id, created_at) VALUES (?, ?, ?, ?)',
      );

      stmt.run(id, userId, postId, now);
      logger.debug(`Like created: ${id}`);

      return { id, user_id: userId, post_id: postId, created_at: now };
    } catch (error) {
      logger.error(`LikeDAO.create failed: ${error.message}`);
      throw error;
    }
  }

  delete(postId, userId) {
    try {
      const stmt = getDatabase().prepare(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      );
      const result = stmt.run(postId, userId);
      logger.debug(`Like deleted: ${postId} by ${userId}`);
      return result.changes > 0;
    } catch (error) {
      logger.error(`LikeDAO.delete failed: ${error.message}`);
      throw error;
    }
  }
}

export default new LikeDAO();
