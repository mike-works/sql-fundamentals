import { existsSync } from "fs";
import * as commander from 'commander';
import { PROJECT_ROOT } from "./constants";
import { initializeDb } from "./db/setup";
import chalk from 'chalk';

const pkg = require('../package.json');

const app = commander
  .version(pkg.version)
  .parse(process.argv);

(async function main() {
  await initializeDb('dev');
}())