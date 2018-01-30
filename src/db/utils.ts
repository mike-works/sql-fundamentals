import { sql } from '../sql-string';
import SQLiteDB from './sqlite-db';
import PostgresDB from './postgres-db';
import { SQLDatabase, SQLStatement } from 'src/db/db';

export async function getDb(name: string): Promise<SQLDatabase<SQLStatement>> {
  return await SQLiteDB.setup(name);
  // return await PostgresDB.setup({
  //   name,
  //   host: 'localhost',
  //   port: 5432
  // });
}
