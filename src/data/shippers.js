import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to select in the `getAllShippers` query
 */
const ALL_SHIPPER_COLUMNS = ['id', 'companyname', 'phone'];

/**
 * Retrieve a collection of all Shipper records from the database
 * @returns {Promise<Shipper[]>} shippers
 */
export async function getAllShippers() {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_SHIPPER_COLUMNS.map(c => `s.${c}`).join(',')}
FROM Shipper as s`);
}
