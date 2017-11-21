import * as fs from 'fs-extra';
import { join } from 'path';
import { promisify } from 'util';
import { PROJECT_ROOT } from './constants';
import { logger } from './log';

interface HelperSet {
  [key: string]: () => any;
}

async function readdir(name: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(name, (err, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

async function getHelperNames() {
  let files: string[] = await readdir(join(PROJECT_ROOT, 'src', 'helpers'));
  return files.map((f) => f.split('.')[0]);
}

export async function loadHandlebarsHelpers(): Promise<HelperSet> {
  let helperNames = await getHelperNames();
  let helpers: HelperSet = {};
  helperNames.reduce<HelperSet>((set, name) => {
    return Object.assign(set, { [`${name}`]: require(`./helpers/${name}`).default});
  }, helpers);
  return helpers;
}
