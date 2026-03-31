import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'microblog.db',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// Validation
if (config.nodeEnv === 'production' && config.jwtSecret === 'dev-secret-key-change-in-production') {
  throw new Error('JWT_SECRET must be set in production');
}
