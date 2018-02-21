// import { initializeDb } from './db/setup';
import { startExpressServer } from './express-server';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

(async function main() {
  const [app, server] = await startExpressServer();
})();
