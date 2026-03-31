import Database from 'better-sqlite3';
import { config } from './config.js';
import logger from './logger.js';

let db = null;

export function initializeDatabase() {
  try {
    db = new Database(config.databaseUrl);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    logger.info('Database initialized successfully');
    return db;
  } catch (error) {
    logger.error(`Database initialization failed: ${error.message}`);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    logger.info('Database connection closed');
  }
}

// Helper function to run migrations
export function runMigrations() {
  const database = getDatabase();

  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  `);

  // Posts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      like_count INTEGER DEFAULT 0,
      reply_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
  `);

  // Likes table
  database.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id),
      UNIQUE(user_id, post_id)
    );
    CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
    CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
  `);

  // Replies table
  database.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
    );
    CREATE INDEX IF NOT EXISTS idx_replies_post_id ON replies(post_id);
    CREATE INDEX IF NOT EXISTS idx_replies_user_id ON replies(user_id);
    CREATE INDEX IF NOT EXISTS idx_replies_created_at ON replies(created_at DESC);
  `);

  logger.info('Database migrations completed successfully');
}
