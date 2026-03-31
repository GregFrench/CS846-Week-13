import { initializeDatabase, runMigrations } from '../src/database.js';
import logger from '../src/logger.js';

try {
  initializeDatabase();
  runMigrations();
  logger.info('Database initialized and migrated successfully');
} catch (error) {
  logger.error(`Failed to initialize database: ${error.message}`);
  process.exit(1);
}
