import { sql } from '../sql-string';
import SQLiteDB from './sqlite-db';
import PostgresDB from './postgres-db';
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
    return await PostgresDB.setup({
      name,
      host: 'localhost',
      port: 5432
    });
  } else {
    return await SQLiteDB.setup(name);
  }
}
