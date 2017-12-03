import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_SUPPLIERS_COLUMNS = ['id', 'contactname', 'companyname'];

function concatClause(colname: string, sortDirection = 'ASC') {
  switch (process.env.DB_TYPE) {
    case 'pg':
      return sql`string_agg(${colname}, ', ')`;
    case 'mysql':
      return sql`group_concat(${colname} ORDER BY ${colname} ${sortDirection} SEPARATOR ', ')`;
    case 'sqlite':
      return sql`group_concat(${colname}, ', ')`;
    default:
      throw new Error(`Unknown db type: ${process.env.DB_TYPE}`);
  }
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const db = await getDb();
  let query = sql`
  SELECT ${ALL_SUPPLIERS_COLUMNS.map(c => `sp.${c}`).join(
      ', '
    )}, ${concatClause('sp.productname', 'ASC')} AS productlist FROM
  (SELECT ${ALL_SUPPLIERS_COLUMNS.map(c => `s.${c}`).join(
      ', '
    )}, p.productname FROM  Supplier AS s
  LEFT JOIN Product AS p
    ON p.supplierid=s.id
  ORDER BY s.id ASC, p.productname ASC) AS sp
  GROUP BY sp.id, sp.contactname, sp.companyname
  ORDER BY sp.id
  `;
  return await db.all(query);
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
