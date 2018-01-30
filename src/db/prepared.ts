import { sql } from '../sql-string';
import { ORDER_COLUMNS } from '../data/orders';
import { SQLDatabase, SQLStatement } from './db';

export async function setupPreparedStatements<S extends SQLStatement, D extends SQLDatabase<S>>(db: D): Promise<{ [k: string]: S }> {
  return {};
}
