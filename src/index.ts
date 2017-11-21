import chalk from 'chalk';
import * as commander from 'commander';
import { existsSync } from 'fs';
import * as path from 'path';
import { initializeDb } from './db/setup';
import { startExpressServer } from './express-server';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

const program = commander
  .version(pkg.version)
  .parse(process.argv);

(async function main() {
  await initializeDb('dev');
  const { server, app } = await startExpressServer();
}());
