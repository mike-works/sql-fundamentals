import { startExpressServer } from './express-server';

(async function main() {
  const [app, server] = await startExpressServer();
})();
