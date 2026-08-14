import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';

describe('Auth Module (/api/v1/auth)', () => {
  const app = createApp();

  it('authenticates valid Admin credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'Admin', password: 'Admin@123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'Admin', password: 'WrongPassword' });
    expect(res.status).toBe(401);
  });

  it('validates empty payload with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: '', password: '' });
    expect(res.status).toBe(400);
  });
});
