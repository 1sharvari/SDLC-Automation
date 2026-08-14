import * as appModule from './app.js';

const PORT = process.env.PORT || 3000;
const serverApp = appModule.app || appModule.createApp();

serverApp.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
