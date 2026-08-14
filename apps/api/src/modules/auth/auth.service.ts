import type { LoginRequest, LoginResponse } from './auth.dto.js';

export class AuthService {
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (credentials.username === 'Admin' && credentials.password === 'Admin@123') {
      return {
        token: 'mock-jwt-token-admin-12345',
        user: {
          id: 'usr-admin-001',
          username: 'Admin',
          name: 'Administrator',
          role: 'Admin'
        }
      };
    }
    throw new Error('INVALID_CREDENTIALS');
  }
}
