import { sql } from '../sql-string';
import { SQLDatabase, SQLStatement } from 'src/db/db';
import { logger } from '../log';

enum DbType {
  Postgres,
  SQLite
}

const DB_TYPE: DbType = determineDbType();

function determineDbType(): DbType {
  switch ((process.env.DB_TYPE || '').trim().toLowerCase()) {
    case 'postgres':
      logger.info('Database Type: PostgreSQL');
      return DbType.Postgres;
    default:
      logger.info('Database Type: SQLite');
      return DbType.SQLite;
  }
}

export async function getDb(name: string): Promise<SQLDatabase<SQLStatement>> {
  if (DB_TYPE === DbType.Postgres) {
    // tslint:disable-next-line:variable-name
    const PostgresDB = require('./postgres-db').default;
    return await PostgresDB.setup({
      name,
      host: 'localhost',
      port: 5432
    });
  } else {
    // tslint:disable-next-line:variable-name
    const SQLiteDB = require('./sqlite-db').default;
    return await SQLiteDB.setup(name);
  }
}
