import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_REGIONS_COLUMNS = ['id', 'regiondescription'];

export async function getAllRegions(): Promise<Region[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_REGIONS_COLUMNS.map(c => `r.${c}`).join(',')}
FROM Region as r`);
}
