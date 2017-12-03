import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to select in the `getAllSuppliers` query
 */
const ALL_SUPPLIERS_COLUMNS = ['id', 'contactname', 'companyname'];

/**
 * Generate the appropriate string concatenation aggregate function, depending on the database being used
 *
 * @param {string} colname column to concatenate
 * @param {string} [sortDirection='ASC'] sort direction of concatenated array
 * @returns {string}
 */
function concatClause(colname, sortDirection = 'ASC', dbType = process.env.DB_TYPE) {
  switch (dbType) {
    case 'pg':
      return sql`string_agg(${colname}, ', ')`;
    case 'mysql':
      return sql`group_concat(${colname} ORDER BY ${colname} ${sortDirection} SEPARATOR ', ')`;
    case 'sqlite':
    default:
      return sql`group_concat(${colname}, ', ')`;
  }
}

/**
 * Retrieve a collection of all Supplier records from the database
 * @return {Promise<Supplier[]>}
 */
export async function getAllSuppliers() {
  const db = await getDb();
  let query = sql`
  SELECT ${ALL_SUPPLIERS_COLUMNS.map(c => `sp.${c}`).join(', ')}, ${concatClause(
    'sp.productname',
    'ASC'
  )} AS productlist FROM
  (SELECT ${ALL_SUPPLIERS_COLUMNS.map(c => `s.${c}`).join(', ')}, p.productname FROM  Supplier AS s
  LEFT JOIN Product AS p
    ON p.supplierid=s.id
  ORDER BY s.id ASC, p.productname ASC) AS sp
  GROUP BY sp.id, sp.contactname, sp.companyname
  ORDER BY sp.id
  `;
  return await db.all(query);
}

/**
 * Retrieve an individual Supplier record from the database, by id
 * @param {string|number} id Supplier id
 * @return {Promise<Supplier>} the supplier
 */
export async function getSupplier(id) {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *
FROM Supplier
WHERE id = $1`,
    id
  );
}
