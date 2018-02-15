import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_CUSTOMERS_COLUMNS = ['*'];

interface CustomerCollectionOptions {
  filter?: string;
}

export async function getAllCustomers(
  options: CustomerCollectionOptions = {}
): Promise<Customer[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_CUSTOMERS_COLUMNS.join(',')}
FROM Customer`);
}

export async function getCustomer(id: string | number): Promise<Customer> {
  const db = await getDb('dev');
  return await db.get(
    sql`
SELECT *
FROM Customer
WHERE id = $1`,
    id
  );
}
