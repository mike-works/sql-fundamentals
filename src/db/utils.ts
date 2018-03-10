import { SQLDatabase, SQLStatement } from 'src/db/db';

import { logger } from '../log';

enum DbType {
  Postgres,
  MySQL,
  SQLite
}

const DB_TYPE: DbType = determineDbType();

function determineDbType(): DbType {
  switch ((process.env.DB_TYPE || '').trim().toLowerCase()) {
    case 'pg':
      logger.info('Database Type: PostgreSQL');
      return DbType.Postgres;
    case 'mysql':
      logger.info('Database Type: MySQL');
      return DbType.MySQL;
    default:
      logger.info('Database Type: SQLite');
      return DbType.SQLite;
  }
}

export async function getDb(): Promise<SQLDatabase<SQLStatement>> {
  if (DB_TYPE === DbType.Postgres) {
    // tslint:disable-next-line:variable-name
    const PostgresDB = require('./postgres-db').default;
    return await PostgresDB.setup();
  } else if (DB_TYPE === DbType.MySQL) {
    const MySQLDB = require('./mysql-db').default;
    return await MySQLDB.setup();
  } else {
    // tslint:disable-next-line:variable-name
    const SQLiteDB = require('./sqlite-db').default;
    return await SQLiteDB.setup();
  }
}
