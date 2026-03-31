import request from 'supertest';
import app from '../src/index.js';
import { initializeDatabase, runMigrations, getDatabase } from '../src/database.js';

describe('Post Routes', () => {
  let token;
  let userId;

  beforeAll(() => {
    initializeDatabase();
    runMigrations();
  });

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: `testuser${Math.random()}`,
        email: `test${Math.random()}@example.com`,
        password: 'password123',
      });

    token = res.body.token;
    userId = res.body.user.id;
  });

  afterEach(() => {
    const db = getDatabase();
    db.prepare('DELETE FROM replies').run();
    db.prepare('DELETE FROM likes').run();
    db.prepare('DELETE FROM posts').run();
    db.prepare('DELETE FROM users').run();
  });

  describe('GET /api/posts', () => {
    it('should get empty feed', async () => {
      const res = await request(app).get('/api/posts');

      expect(res.statusCode).toBe(200);
      expect(res.body.posts).toEqual([]);
    });

    it('should get feed with pagination', async () => {
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Test post 1' });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Test post 2' });

      const res = await request(app)
        .get('/api/posts')
        .query({ limit: 10, offset: 0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.posts.length).toBe(2);
      expect(res.body.limit).toBe(10);
      expect(res.body.offset).toBe(0);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Hello, World!' });

      expect(res.statusCode).toBe(201);
      expect(res.body.post.content).toBe('Hello, World!');
      expect(res.body.post.user_id).toBe(userId);
    });

    it('should return 400 for empty content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for content over 280 chars', async () => {
      const longContent = 'a'.repeat(281);
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: longContent });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ content: 'Hello, World!' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/posts/:postId', () => {
    it('should get a single post', async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Test post' });

      const postId = createRes.body.post.id;

      const res = await request(app).get(`/api/posts/${postId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.post.content).toBe('Test post');
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app).get('/api/posts/00000000-0000-0000-0000-000000000000');

      expect(res.statusCode).toBe(404);
    });
  });
});
