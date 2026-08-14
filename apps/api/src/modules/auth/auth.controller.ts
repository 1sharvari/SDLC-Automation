import type { Request, Response } from 'express';
import { LoginRequestSchema } from './auth.dto.js';
import { AuthService } from './auth.service.js';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const parseResult = LoginRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid login payload',
          details: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
        }
      });
      return;
    }
    try {
      const result = await this.authService.login(parseResult.data);
      res.status(200).json(result);
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
        return;
      }
      res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
    }
  };
}
