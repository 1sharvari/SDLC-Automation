import * as appModule from './app.js';

const app =
  typeof (appModule as any).createApp === 'function'
    ? (appModule as any).createApp()
    : (appModule as any).default || (appModule as any).app || appModule;

const port = Number(process.env.PORT ?? 3000);

if (app && typeof app.listen === 'function') {
  app.listen(port, () => {
    console.log(`Node API running on http://localhost:${port}/api/v1`);
  });
}
