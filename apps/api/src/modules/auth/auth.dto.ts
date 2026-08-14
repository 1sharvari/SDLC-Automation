import { z } from 'zod';

export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface LoginResponseDto {
  token: string;
  user: AuthUser;
}
