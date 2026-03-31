import request from 'supertest';
import app from '../src/index.js';
import { initializeDatabase, runMigrations, getDatabase } from '../src/database.js';

describe('Like Routes', () => {
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

  describe('POST /api/posts/:postId/likes', () => {
    it('should like a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.like).toHaveProperty('id');
      expect(res.body.like.post_id).toBe(postId);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post(`/api/posts/${postId}/likes`);

      expect(res.statusCode).toBe(401);
    });

    it('should return 409 if already liked', async () => {
      await request(app)
        .post(`/api/posts/${postId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .post(`/api/posts/${postId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(409);
    });
  });

  describe('DELETE /api/posts/:postId/likes', () => {
    it('should unlike a post', async () => {
      await request(app)
        .post(`/api/posts/${postId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .delete(`/api/posts/${postId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
