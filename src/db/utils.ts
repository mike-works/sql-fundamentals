import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as sqlite from 'sqlite';
import { MASTER_DB_FILE, PROJECT_ROOT } from '../constants';
import { logger } from '../log';

interface Database extends sqlite.Database {
  statements?: {
    [key: string]: sqlite.Statement;
  };
}

async function fileExists(pth: string) {
  return new Promise(resolve => {
    fs.exists(pth, resolve);
  });
}

const copyFile = (src: string, dst: string) =>
  new Promise((resolve, reject) => {
    fs.copy(src, dst, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const dbPath = (name: string) => path.join(PROJECT_ROOT, `${name}.sqlite`);

const dbPromises: { [key: string]: Promise<Database> } = {};

async function buildPreparedStatements(db: Database): Promise<{ [key: string]: sqlite.Statement }> {
  let statements: { [key: string]: sqlite.Statement } = {};
  statements.totalRevenue = await db.prepare('SELECT sum(UnitPrice*(1-Discount)*Quantity) as val from OrderDetail');
  return statements;
}

export async function getDb(name: string): Promise<Database> {
  let pathToDb = dbPath(name);
  let doesExist = await fileExists(pathToDb);
  let db: Database;
  if (!doesExist) {
    await initializeDb(name);
  }
  if (dbPromises[name]) {
    return await dbPromises[name];
  }
  dbPromises[name] = sqlite.open(pathToDb, {
    verbose: true
  });
  db = await dbPromises[name];
  db.statements = await buildPreparedStatements(db);
  if (process.env.NODE_ENV !== 'test') {
    db.on('profile', (sql: string, time: number) => {
      logger.info([chalk.cyan(sql), `(${chalk.yellow(`${time.toPrecision(2)}ms`)})`].join(' '));
    });
  }
  return db;
}

export async function initializeDb(dbName = 'dev') {
  let pth = dbPath(dbName);
  if (!fs.existsSync(pth)) {
    logger.debug(`Database ${dbName} was not found at ${pth}... creating it now`);
    await copyFile(MASTER_DB_FILE, pth);
  }
}
