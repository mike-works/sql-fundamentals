import { getDb, DbType, DB_TYPE } from '../db/utils';
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
  return await db.all(sql`SELECT * from SupplierList_V`);
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
