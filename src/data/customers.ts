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
WHERE companyname LIKE $1
OR contactname LIKE $1
`;
    params.push(`%${options.filter}%`);
  }
  return await db.all(
    sql`
  SELECT ${ALL_CUSTOMERS_COLUMNS.map(c => `c.${c}`).join(
    ','
  )},count(o.Id) as ordercount
FROM Customer as c
LEFT JOIN "order" as o
   ON o.customerid=c.id
${whereClause}
GROUP BY c.id`,
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
