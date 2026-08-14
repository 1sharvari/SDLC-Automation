import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import { createAuthRouter } from './modules/auth/auth.routes.js';

export const createApp = (): Express => {
  const app = express();
  app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:4200' }));
  app.use(express.json());

  app.get('/api/v1/health', (_request: Request, response: Response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/auth', createAuthRouter());

  app.use((_request: Request, response: Response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  return app;
};

export const app = createApp();
export default app;
