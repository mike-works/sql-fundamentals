import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as sqlite from 'sqlite';

import * as dbConfig from '../../database.json';
import { PROJECT_ROOT } from '../constants';
import { logger } from '../log';
import { sql } from '../sql-string';

import { SQLDatabase } from './db';
import { setupPreparedStatements } from './prepared';
import { timeout } from './utils';

const MASTER_DB_FILE = path.join(PROJECT_ROOT, dbConfig.sqlite.filename);

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

const dbPromises: { [k: string]: Promise<SQLiteDB> } = {};

export default class SQLiteDB extends SQLDatabase {
  public static async setup(): Promise<SQLiteDB> {
    let name = dbConfig.sqlite.filename;
    if (dbPromises[name]) {
      return dbPromises[name];
    }
    let pathToDb = path.join(PROJECT_ROOT, name);
    let doesExist = await fileExists(pathToDb);

    if (!doesExist) {
      if (!fs.existsSync(pathToDb)) {
        logger.debug(`Database not found at ${pathToDb}...creating it now`);
        await copyFile(MASTER_DB_FILE, pathToDb);
      }
    } else {
      if (process.env.NODE_ENV !== 'test') {
        logger.info(chalk.yellow(`Reading from SQLite database at ${pathToDb}`));
      }
    }

    dbPromises[name] = sqlite.open(pathToDb, { verbose: true }).then(sqliteDb => {
      let db = new SQLiteDB(sqliteDb);
      return db
        .get(sql`PRAGMA foreign_keys = ON`)
        .then(() => {
          return setupPreparedStatements(db);
        })
        .then(statements => {
          db.statements = statements;
          return db;
        });
    });
    return dbPromises[name];
  }
  private db: sqlite.Database;
  protected constructor(db: sqlite.Database) {
    super();
    this.db = db;
  }
  public async shutdown(attemptNumber: number = 0): Promise<void> {
    // try {
    //   await this.db.close();
    // } catch (e) {
    //   if (attemptNumber < 6) {
    //     logger.error(
    //       `Could not close SQLite database. (Try ${attemptNumber}) Retrying in a moment...\n${e}`
    //     );
    //     await timeout(1000);
    //     await this.shutdown(attemptNumber + 1);
    //   } else {
    //     logger.error(
    //       `Could not close SQLite database. (Try ${attemptNumber}) Crashing...\n${e}`
    //     );
    //   }
    // }
  }
  public async run(query: string, ...params: any[]): Promise<{ lastID: string } | void> {
    return this.measure(query, params, async () => {
      let s = await this.db.run(query, ...params);
      return { lastID: `${s.lastID}` };
    });
  }
  public get<T>(query: string, ...params: any[]): Promise<T> {
    return this.measure(query, params, async () => {
      return this.db.get<T>(query, ...params);
    });
  }
  public all<T>(query: string, ...params: any[]): Promise<T[]> {
    return this.measure(query, params, async () => {
      return await this.db.all<T>(query, ...params);
    });
  }
  public async prepare(name: string, query: string, ...params: any[]): Promise<sqlite.Statement> {
    let s = await this.db.prepare(query, ...params);
    this.statements[name] = s;
    return s;
  }
  public async getIndicesForTable(tableName: string): Promise<string[]> {
    return (await this.all(sql`PRAGMA index_list("${tableName}")`)).map((i: any) => i.name);
  }
  public async getAllTriggers(): Promise<string[]> {
    return (await this.all(sql`select * from sqlite_master where type = 'trigger';`)).map(
      (i: any) => i.name as string
    );
  }
  public async getAllViews(): Promise<string[]> {
    return (await this.all(sql`select * from sqlite_master where type = 'view';`)).map(
      (i: any) => i.name as string
    );
  }
  public async getAllTableNames(): Promise<string[]> {
    return (await this.all(sql`SELECT name FROM sqlite_master WHERE type='table';`)).map(
      (i: any) => i.name as string
    );
  }
  public async getAllMaterializedViews(): Promise<string[]> {
    throw new Error('Materialized views are not supported in sqlite');
  }
  public async getAllFunctions(): Promise<string[]> {
    throw new Error('Custom functions are not supported in sqlite');
  }
}
