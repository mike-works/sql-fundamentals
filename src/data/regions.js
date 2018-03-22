import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to select in the `getAllRegions` query
 */
const ALL_REGIONS_COLUMNS = ['id', 'regiondescription'];

/**
 * Retrieve a collection of all Regions from the database
 * @returns {Promise<Region[]>} the regions
 */
export async function getAllRegions() {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_REGIONS_COLUMNS.map(c => `r.${c}`).join(',')}
FROM Region as r`);
}
