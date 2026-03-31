import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { UnauthorizedError } from '../utils/errors.js';
import logger from '../logger.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.debug('No token provided in request');
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    logger.warn(`Token verification failed: ${error.message}`);
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function generateToken(userId, username) {
  try {
    return jwt.sign({ userId, username }, config.jwtSecret, {
      expiresIn: config.jwtExpiry,
    });
  } catch (error) {
    logger.error(`Token generation failed: ${error.message}`);
    throw error;
  }
}
