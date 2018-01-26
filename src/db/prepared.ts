import { Database, Statement } from 'sqlite';
import { sql } from '../sql-string';
import { ORDER_COLUMNS } from '../data/orders';

export async function setupPreparedStatements(db: Database): Promise<{ [k: string]: Statement }> {
  return {};
}
