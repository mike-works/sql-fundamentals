import chalk from 'chalk';
import { existsSync } from 'fs';
import * as path from 'path';
import { initializeDb } from './db/setup';
import { startExpressServer } from './express-server';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

(async function main() {
  await initializeDb('dev');
  const [app, server] = await startExpressServer();
}());
