import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_SUPPLIERS_COLUMNS = ['id', 'contactname', 'companyname'];

export async function getAllSuppliers(): Promise<Supplier[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_SUPPLIERS_COLUMNS.join(',')}
FROM Supplier`);
}

export async function getSupplier(id: string | number): Promise<Supplier> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *
FROM Supplier
WHERE id = $1`,
    id
  );
}
