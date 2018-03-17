import { SQLDatabase, SQLPreparedStatement } from 'src/db/db';

import { logger } from '../log';

/**
 * Type of SQL database application
 * Postgres, MySQL or SQLite
 */
export enum DbType {
  PostgreSQL,
  MySQL,
  SQLite
}

export const DB_TYPE: DbType = determineDbType();

function determineDbType(): DbType {
  switch ((process.env.DB_TYPE || '').trim().toLowerCase()) {
    case 'pg':
      logger.info('Database Type: PostgreSQL');
      return DbType.PostgreSQL;
    case 'mysql':
      logger.info('Database Type: MySQL');
      return DbType.MySQL;
    case 'sqlite':
    default:
      logger.info('Database Type: SQLite');
      return DbType.SQLite;
  }
}

/**
 * Get a database connection
 *
 * Use the DB_TYPE environment variable to switch between
 * SQLite, PostgreSQL and MySQL database connections. Define
 * connection details in the ./database.json
 */
export async function getDb(): Promise<SQLDatabase> {
  if (DB_TYPE === DbType.PostgreSQL) {
    // tslint:disable-next-line:variable-name
    const PostgresDB = require('./postgres-db').default;
    return await PostgresDB.setup();
  } else if (DB_TYPE === DbType.MySQL) {
    // tslint:disable-next-line:variable-name
    const MySQLDB = require('./mysql-db').default;
    return await MySQLDB.setup();
  } else {
    // tslint:disable-next-line:variable-name
    const SQLiteDB = require('./sqlite-db').default;
    return await SQLiteDB.setup();
  }
}

export async function timeout(n: number) {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}
