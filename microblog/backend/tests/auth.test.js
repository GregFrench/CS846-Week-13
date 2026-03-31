import request from 'supertest';
import app from '../src/index.js';
import { initializeDatabase, runMigrations, getDatabase } from '../src/database.js';

describe('Auth Routes', () => {
  beforeAll(() => {
    initializeDatabase();
    runMigrations();
  });

  afterEach(() => {
    const db = getDatabase();
    db.prepare('DELETE FROM replies').run();
    db.prepare('DELETE FROM likes').run();
    db.prepare('DELETE FROM posts').run();
    db.prepare('DELETE FROM users').run();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
      expect(res.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          email: 'invalid-email',
          password: '123',
        });

      expect(res.statusCode).toBe(400);
    });

    it('should return 409 for duplicate username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test1@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test2@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        });

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 for wrong password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
