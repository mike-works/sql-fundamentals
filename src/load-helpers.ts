import * as fs from 'fs-extra';
import { join } from 'path';

import { PROJECT_ROOT } from './constants';

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
  return files.map(f => f.split('.')[0]);
}

export async function loadHandlebarsHelpers(): Promise<Handlebars.HelperSet> {
  let helperNames = await getHelperNames();
  let helpers: Handlebars.HelperSet = {};
  helperNames.reduce<Handlebars.HelperSet>((set, name) => {
    return Object.assign(set, {
      [`${name}`]: require(`./helpers/${name}`).default
    });
  }, helpers);
  return helpers;
}
