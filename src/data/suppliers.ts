import { getDb, DbType, DB_TYPE } from '../db/utils';
import { sql } from '../sql-string';

const ALL_SUPPLIERS_COLUMNS = ['id', 'contactname', 'companyname'];

function concatClause(colname: string, sortDirection = 'ASC') {
  switch (DB_TYPE) {
    case DbType.Postgres:
      return sql`string_agg(${colname}, ', ')`;
    case DbType.MySQL:
      return sql`group_concat(${colname} ORDER BY ${colname} ${sortDirection} SEPARATOR ', ')`;
    case DbType.SQLite:
      return sql`group_concat(${colname}, ', ')`;
    default:
      throw new Error(`Unknown db type: ${process.env.DB_TYPE}`);
  }
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const db = await getDb();
  return await db.all(sql`SELECT * from SupplierList_V`);
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
