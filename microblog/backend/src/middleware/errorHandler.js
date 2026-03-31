import { AppError, InternalServerError } from '../utils/errors.js';
import logger from '../logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}`);

  // Handle Joi validation errors
  if (err.details && Array.isArray(err.details)) {
    const messages = err.details.map((d) => d.message);
    return res.status(400).json({ error: 'Validation error', messages });
  }

  // Handle AppError subclasses
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Handle unknown errors
  const internalError = new InternalServerError();
  return res.status(internalError.statusCode).json({
    error: internalError.name,
    message: internalError.message,
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
