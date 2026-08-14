import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { productsRouter } from './modules/products/products.routes.js';
import { cartRouter } from './modules/cart/cart.routes.js';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/products', productsRouter);
  app.use('/api/v1/cart', cartRouter);

  // Error handling middleware
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(400).json({ success: false, message });
  });

  return app;
};

export const app = createApp();
export default app;
