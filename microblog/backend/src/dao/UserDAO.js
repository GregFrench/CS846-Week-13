import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database.js';
import logger from '../logger.js';

export class UserDAO {
  findByUsername(username) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM users WHERE username = ?');
      return stmt.get(username);
    } catch (error) {
      logger.error(`UserDAO.findByUsername failed: ${error.message}`);
      throw error;
    }
  }

  findByEmail(email) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM users WHERE email = ?');
      return stmt.get(email);
    } catch (error) {
      logger.error(`UserDAO.findByEmail failed: ${error.message}`);
      throw error;
    }
  }

  findById(id) {
    try {
      const stmt = getDatabase().prepare('SELECT * FROM users WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      logger.error(`UserDAO.findById failed: ${error.message}`);
      throw error;
    }
  }

  create(username, email, passwordHash) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const stmt = getDatabase().prepare(
        'INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      );

      stmt.run(id, username, email, passwordHash, now, now);
      logger.info(`User created: ${username}`);

      return { id, username, email, created_at: now };
    } catch (error) {
      logger.error(`UserDAO.create failed: ${error.message}`);
      throw error;
    }
  }

  formatUser(user) {
    if (!user) return null;
    const { password_hash, ...rest } = user;
    return rest;
  }
}

export default new UserDAO();
