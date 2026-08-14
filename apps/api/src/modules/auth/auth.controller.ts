import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { LoginRequestSchema } from './auth.dto';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validationResult = LoginRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors.map((e) => e.message)
        });
        return;
      }

      const result = await this.authService.authenticate(validationResult.data);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.statusCode === 401) {
        res.status(401).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
}
