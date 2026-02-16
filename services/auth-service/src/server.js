import http from 'http';
import mongoose from 'mongoose';

import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import logger from './config/logger.js';

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = http.createServer(app);
    server.listen(env.PORT, () => {
      logger.info(`Auth Service is running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Startup error:', error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async (signal) => {
  logger.warn(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      logger.info('Server Closed. Exiting process.');
      process.exit(0);
    });
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  gracefulShutdown('Unhandled Rejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('Uncaught Exception');
});
