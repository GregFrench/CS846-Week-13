import logger from '../logger.js';

export function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 400 ? 'warn' : 'info';

    logger[level](
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
}
