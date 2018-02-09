import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_SHIPPER_COLUMNS = ['Id', 'CompanyName', 'Phone'];

export async function getAllShippers(): Promise<Shipper[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_SHIPPER_COLUMNS.map(c => `s.${c}`).join(',')}
FROM Shipper as s`);
}
