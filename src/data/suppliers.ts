import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to select in the `getAllSuppliers` query
 */
const ALL_SUPPLIERS_COLUMNS = ['*'];

/**
 * Retrieve a collection of all Supplier records from the database
 */
export async function getAllSuppliers(): Promise<Supplier[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_SUPPLIERS_COLUMNS.join(',')}
FROM Supplier`);
}

/**
 * Retrieve an individual Supplier record from the database, by id
 * @param id Supplier id
 */
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
