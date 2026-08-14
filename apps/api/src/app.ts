import express, { Express, json } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(json());

  // API Routes
  app.use('/api/v1/auth', authRouter);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
}

export const app = createApp();
