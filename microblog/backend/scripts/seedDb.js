import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import { initializeDatabase, runMigrations, getDatabase } from '../src/database.js';
import logger from '../src/logger.js';

async function seedDatabase() {
  try {
    initializeDatabase();
    runMigrations();
    const db = getDatabase();

    logger.info('Seeding database with sample data...');

    // Create sample users
    const users = [];
    const usernames = ['alice', 'bob', 'charlie', 'diana', 'eve'];

    for (const username of usernames) {
      const userId = uuidv4();
      const passwordHash = await bcryptjs.hash('password123', 10);
      const now = new Date().toISOString();

      db.prepare(
        'INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      ).run(userId, username, `${username}@example.com`, passwordHash, now, now);

      users.push({ id: userId, username });
    }

    // Create sample posts
    const posts = [];
    const postContents = [
      'Hello everyone! Just joined Microblog 👋',
      'What a beautiful day for coding! ☀️',
      'Just launched my new project! 🚀',
      'Coffee and code - the perfect combination ☕',
      'Learning React is amazing! 💻',
      'Open source contributions are so rewarding',
      'Who else loves debugging at 3 AM? 😅',
      'Just shipped a new feature!',
      'The best time to plant a tree was 20 years ago, the second best is now.',
      'Excited to share my progress with you all!',
    ];

    for (let i = 0; i < postContents.length; i++) {
      const postId = uuidv4();
      const user = users[i % users.length];
      const now = new Date(Date.now() - i * 3600000).toISOString();

      db.prepare(
        'INSERT INTO posts (id, user_id, content, like_count, reply_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ).run(postId, user.id, postContents[i], Math.floor(Math.random() * 20), Math.floor(Math.random() * 5), now, now);

      posts.push({ id: postId, userId: user.id });
    }

    // Create sample replies
    const replies = [
      'Great post!',
      'I totally agree with this',
      'This is exactly what I needed!',
      'Amazing insights here',
      'Thank you for sharing!',
    ];

    for (let i = 0; i < posts.length; i += 2) {
      const replyUser = users[Math.floor(Math.random() * users.length)];
      const replyId = uuidv4();
      const now = new Date().toISOString();

      db.prepare(
        'INSERT INTO replies (id, user_id, post_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      ).run(
        replyId,
        replyUser.id,
        posts[i].id,
        replies[i % replies.length],
        now,
        now,
      );

      // Update reply count
      db.prepare('UPDATE posts SET reply_count = reply_count + 1 WHERE id = ?').run(posts[i].id);
    }

    // Create sample likes
    for (let i = 0; i < posts.length; i++) {
      const numLikes = Math.floor(Math.random() * 3);
      for (let j = 0; j < numLikes; j++) {
        const likeUser = users[j % users.length];
        const likeId = uuidv4();
        const now = new Date().toISOString();

        try {
          db.prepare('INSERT INTO likes (id, user_id, post_id, created_at) VALUES (?, ?, ?, ?)').run(
            likeId,
            likeUser.id,
            posts[i].id,
            now,
          );

          db.prepare('UPDATE posts SET like_count = like_count + 1 WHERE id = ?').run(posts[i].id);
        } catch {
          // Ignore duplicate likes
        }
      }
    }

    logger.info(`Seeded database with ${users.length} users and ${posts.length} posts`);
    logger.info('Sample user credentials:');
    usernames.forEach((username) => {
      logger.info(`  Username: ${username}, Password: password123`);
    });
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedDatabase();
