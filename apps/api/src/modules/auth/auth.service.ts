import { LoginRequestDto, LoginResponseDto } from './auth.dto';

export class AuthService {
  // In a full production application, hashed passwords in a database are used.
  private readonly validCredentials = [
    {
      id: 'usr_admin_001',
      username: 'Admin',
      password: 'Admin@123',
      role: 'ADMIN'
    }
  ];

  public async authenticate(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const matchedUser = this.validCredentials.find(
      (u) => u.username === dto.username && u.password === dto.password
    );

    if (!matchedUser) {
      const error = new Error('Invalid username or password');
      (error as Error & { statusCode: number }).statusCode = 401;
      throw error;
    }

    // In real app, issue JWT token signed with secret key
    const token = `jwt_token_${matchedUser.id}_${Date.now()}`;

    return {
      token,
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        role: matchedUser.role
      }
    };
  }
}
