import request from 'supertest';
import { describe, expect, it } from 'vitest';
import * as appModule from './app.js';

const getApp = () => {
  if (typeof (appModule as any).createApp === 'function') {
    return (appModule as any).createApp();
  }
  return (appModule as any).default || (appModule as any).app || appModule;
};

describe('API Baseline', () => {
  it('returns status 200 for health check', async () => {
    const res = await request(getApp()).get('/api/v1/health');
    expect(res.status).toBe(200);
  });
});
