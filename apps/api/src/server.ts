import { createApp, app } from './app.js';

const serverApp = typeof createApp === 'function' ? createApp() : app;
const port = Number(process.env.PORT ?? 3000);

serverApp.listen(port, () => {
  console.log(`Node API running on http://localhost:${port}/api/v1`);
});
