import bcryptjs from 'bcryptjs';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';
import userDAO from '../dao/UserDAO.js';
import { generateToken } from '../middleware/auth.js';
import logger from '../logger.js';

export class AuthService {
  async register(username, email, password) {
    try {
      // Check if user already exists
      const existingUser = userDAO.findByUsername(username);
      if (existingUser) {
        throw new ConflictError('Username');
      }

      const existingEmail = userDAO.findByEmail(email);
      if (existingEmail) {
        throw new ConflictError('Email');
      }

      // Hash password
      const passwordHash = await bcryptjs.hash(password, 10);

      // Create user
      const user = userDAO.create(username, email, passwordHash);
      logger.info(`User registered: ${username}`);

      // Generate token
      const token = generateToken(user.id, user.username);

      return {
        user: userDAO.formatUser(user),
        token,
      };
    } catch (error) {
      logger.error(`AuthService.register failed: ${error.message}`);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const user = userDAO.findByUsername(username);

      if (!user) {
        throw new UnauthorizedError('Invalid username or password');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid username or password');
      }

      const token = generateToken(user.id, user.username);
      logger.info(`User logged in: ${username}`);

      return {
        user: userDAO.formatUser(user),
        token,
      };
    } catch (error) {
      logger.error(`AuthService.login failed: ${error.message}`);
      throw error;
    }
  }
}

export default new AuthService();
