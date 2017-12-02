import * as sqlite from 'sqlite';
import { getDb } from '../db/utils';

const ALL_SUPPLIERS_COLUMNS = ['*'];

export async function getAllSuppliers(): Promise<Supplier[]> {
  const db = await getDb('dev');
  return await db.all(`
SELECT ${ALL_SUPPLIERS_COLUMNS.join(',')}
FROM Supplier
`);
}

export async function getSupplier(id: string | number): Promise<Supplier> {
  const db = await getDb('dev');
  return await db.get(
    `
SELECT *
FROM Supplier
WHERE id = $1
`,
    id
  );
}
