import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import env from './config/env.js';
import logger from './config/logger.js';
import authRoutes from './routes/auth.route.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(compression());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }),
);

app.get('/health', (req, res) => {
  res.json({
    service: 'Auth Service',
    status: 'Healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

export default app;
