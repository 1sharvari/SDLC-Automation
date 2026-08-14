import { z } from 'zod';

export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface UserProfile {
  id: string;
  username: string;
  role: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}
