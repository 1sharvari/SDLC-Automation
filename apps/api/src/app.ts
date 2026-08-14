import cors from 'cors';
import express, { type Request, type Response } from 'express';

export const createApp = () => {
  const app = express();
  app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:4200' }));
  app.use(express.json());

  app.get('/api/v1/health', (_request: Request, response: Response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use((_request: Request, response: Response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  return app;
};
