import { Router } from 'express';
import { AuthController } from './auth.controller.js';

export const createAuthRouter = (): Router => {
  const router = Router();
  const controller = new AuthController();
  router.post('/login', controller.login);
  return router;
};
