import * as fs from 'fs';
import * as path from 'path';
import { colorizeQuery } from './db/db';

const MIGRATION_PATH = path.join(__dirname, '..', 'migrations');

export interface Migration {
  _meta: {
    version: number;
  };
  setup(options: any, seedLink: any): void;
  up(db: any): void;
  down(db: any): void;
}

function getDbType(db: any) {
  if (db.connection.config) {
    return 'mysql';
  }
  if (db.connection.port) {
    return 'pg';
  }
  return 'sqlite';
}

export function sqlFileMigration(name: string): Migration {
  let dbm;
  let type;
  let seed;
  // tslint:disable-next-line:variable-name
  let Promise: PromiseConstructor;
  /**
   * We receive the dbmigrate dependency from dbmigrate initially.
   * This enables us to not have to rely on NODE_PATH.
   */
  function setup(options: any, seedLink: any) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
    Promise = options.Promise;
  }

  function up(db: any) {
    let dbType = getDbType(db);
    let filePath = path.join(
      MIGRATION_PATH,
      'sqls',
      `${name}/${dbType}-up.sql`
    );
    return new Promise((resolve, reject) => {
      fs.readFile(
        filePath,
        {
          encoding: 'utf-8'
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          // tslint:disable-next-line:no-console
          console.log(
            `Running UP migration: ${name}\n──────────────────────────────────────────────────────\n${colorizeQuery(
              data
            )}\n──────────────────────────────────────────────────────`
          );
          resolve(data);
        }
      );
    }).then(data => {
      return db.runSql(data);
    });
  }

  function down(db: any) {
    let dbType = getDbType(db);
    let filePath = path.join(
      MIGRATION_PATH,
      'sqls',
      `${name}/${dbType}-down.sql`
    );
    return new Promise((resolve, reject) => {
      fs.readFile(
        filePath,
        {
          encoding: 'utf-8'
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          // tslint:disable-next-line:no-console
          console.log(
            `Running DOWN migration: ${name}\n──────────────────────────────────────────────────────\n${colorizeQuery(
              data
            )}\n──────────────────────────────────────────────────────`
          );

          resolve(data);
        }
      );
    }).then(data => {
      return db.runSql(data);
    });
  }

  const _meta = {
    version: 1
  };

  return { setup, up, down, _meta };
}
