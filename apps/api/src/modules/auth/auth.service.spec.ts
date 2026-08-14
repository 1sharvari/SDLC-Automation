import { describe, it, expect } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const service = new AuthService();

  it('should authenticate valid credentials and return user and token', async () => {
    const response = await service.authenticate({
      username: 'Admin',
      password: 'Admin@123'
    });

    expect(response).toBeDefined();
    expect(response.user.username).toBe('Admin');
    expect(response.user.role).toBe('ADMIN');
    expect(response.token).toContain('jwt_token_');
  });

  it('should throw a 401 error for invalid credentials', async () => {
    await expect(
      service.authenticate({
        username: 'Admin',
        password: 'WrongPassword'
      })
    ).rejects.toThrow('Invalid username or password');
  });
});
