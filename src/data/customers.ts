import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';
import { dbPath, getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_CUSTOMERS_COLUMNS = ['*'];

interface AllCustOptions {
  filter?: string;
}

export async function getAllCustomers(options: AllCustOptions = {}): Promise<Customer[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_CUSTOMERS_COLUMNS.join(',')}
FROM Customer
`);
}

export async function getCustomer(id: string | number): Promise<Customer> {
  const db = await getDb('dev');
  return await db.get(sql`
SELECT *
FROM Customer
WHERE id = $1
`, id);
}
