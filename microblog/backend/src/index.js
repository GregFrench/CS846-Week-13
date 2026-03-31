import express from 'express';
import cors from 'cors';
import { initializeDatabase, runMigrations } from './database.js';
import { errorHandler, asyncHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logging.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import replyRoutes from './routes/replyRoutes.js';
import { config } from './config.js';
import logger from './logger.js';

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: config.corsOrigin }));
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts/:postId/likes', likeRoutes);
app.use('/api/posts/:postId/replies', replyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
export async function startServer() {
  try {
    initializeDatabase();
    runMigrations();

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

export default app;
