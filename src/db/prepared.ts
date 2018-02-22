import { SQLDatabase, SQLStatement } from './db';

export async function setupPreparedStatements<
  S extends SQLStatement,
  D extends SQLDatabase<S>
>(db: D): Promise<{ [k: string]: S }> {
  return {};
}
