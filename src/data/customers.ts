import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_CUSTOMERS_COLUMNS = ['id', 'contactname', 'companyname'];

interface CustomerCollectionOptions {
  filter?: string;
}

export async function getAllCustomers(
  options: CustomerCollectionOptions = {}
): Promise<Customer[]> {
  const db = await getDb();
  let whereClause = '';
  let params: any[] = [];
  if (options.filter) {
    whereClause = sql`
WHERE lower(companyname) LIKE $1
OR lower(contactname) LIKE $2
`;
    params.push(`%${options.filter.toLowerCase()}%`);
    params.push(`%${options.filter.toLowerCase()}%`);
  }
  return await db.all(
    sql`
SELECT ${ALL_CUSTOMERS_COLUMNS.join(',')}
FROM Customer ${whereClause}
`,
    ...params
  );
}

export async function getCustomer(id: string | number): Promise<Customer> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *
FROM Customer
WHERE id = $1`,
    id
  );
}
