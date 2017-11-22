import * as path from 'path';
import * as sqlite from 'sqlite';
import { PROJECT_ROOT } from '../constants';

export const dbPath = (name: string) =>
  path.join(PROJECT_ROOT, `${name}.sqlite`);

const dbPromises: { [key: string]: Promise<sqlite.Database> } = {};

export function getDb(name: string) {
  if (!dbPromises[name]) {
    dbPromises[name] = sqlite.open(dbPath(name));
  }
  return dbPromises[name];
}
