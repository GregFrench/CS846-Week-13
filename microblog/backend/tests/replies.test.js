import request from 'supertest';
import app from '../src/index.js';
import { initializeDatabase, runMigrations, getDatabase } from '../src/database.js';

describe('Reply Routes', () => {
  let token;
  let postId;

  beforeAll(() => {
    initializeDatabase();
    runMigrations();
  });

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: `testuser${Math.random()}`,
        email: `test${Math.random()}@example.com`,
        password: 'password123',
      });

    token = registerRes.body.token;

    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Test post' });

    postId = postRes.body.post.id;
  });

  afterEach(() => {
    const db = getDatabase();
    db.prepare('DELETE FROM replies').run();
    db.prepare('DELETE FROM likes').run();
    db.prepare('DELETE FROM posts').run();
    db.prepare('DELETE FROM users').run();
  });

  describe('GET /api/posts/:postId/replies', () => {
    it('should get empty replies', async () => {
      const res = await request(app).get(`/api/posts/${postId}/replies`);

      expect(res.statusCode).toBe(200);
      expect(res.body.replies).toEqual([]);
    });

    it('should get replies with pagination', async () => {
      await request(app)
        .post(`/api/posts/${postId}/replies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great post!' });

      const res = await request(app)
        .get(`/api/posts/${postId}/replies`)
        .query({ limit: 10, offset: 0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.replies.length).toBe(1);
    });
  });

  describe('POST /api/posts/:postId/replies', () => {
    it('should create a reply', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/replies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great post!' });

      expect(res.statusCode).toBe(201);
      expect(res.body.reply.content).toBe('Great post!');
      expect(res.body.reply.post_id).toBe(postId);
    });

    it('should return 400 for empty content', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/replies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/replies`)
        .send({ content: 'Great post!' });

      expect(res.statusCode).toBe(401);
    });

    it('should increment reply count', async () => {
      await request(app)
        .post(`/api/posts/${postId}/replies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great post!' });

      const postRes = await request(app).get(`/api/posts/${postId}`);

      expect(postRes.body.post.reply_count).toBe(1);
    });
  });
});
