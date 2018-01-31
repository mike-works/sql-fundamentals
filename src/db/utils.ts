import { sql } from '../sql-string';
import SQLiteDB from './sqlite-db';
import PostgresDB from './postgres-db';
import { SQLDatabase, SQLStatement } from 'src/db/db';

enum DbType {
  Postgres,
  SQLite
}

const DB_TYPE: DbType = determineDbType();

function determineDbType(): DbType {
  switch ((typeof process.env.DB_TYPE || '').toLowerCase()) {
    case 'postgres':
      return DbType.Postgres;
    default:
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
