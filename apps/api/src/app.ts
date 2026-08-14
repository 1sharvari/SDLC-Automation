import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';

export const createApp = (): Express => {
  const app = express();
  app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:4200' }));
  app.use(express.json());

  app.get('/api/v1/health', (_request: Request, response: Response) => {
    response.status(200).json({ status: 'ok' });
  });

  return app;
};

export const app = createApp();
export default app;
