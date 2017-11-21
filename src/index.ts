import chalk from 'chalk';
import * as commander from 'commander';
import * as express from 'express';
import { existsSync } from 'fs';
import { PORT, PROJECT_ROOT } from './constants';
import { initializeDb } from './db/setup';
import router from './routes/main';
import { logger } from './utils';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

const program = commander
  .version(pkg.version)
  .parse(process.argv);

(async function main() {
  await initializeDb('dev');
  const app = express();

  app.use(router);

  const server = app.listen(PORT, () => {
    logger.info('Server listening on http://localhost:3000');
  });
}());
