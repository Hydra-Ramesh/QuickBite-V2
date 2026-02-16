import mongoose from 'mongoose';
import env from './env.js';
import logger from './logger.js';

const connectDB = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info('Connected to MongoDB');
};

export default connectDB;
