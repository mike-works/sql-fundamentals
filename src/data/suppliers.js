import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to select in the `getAllSuppliers` query
 */
const ALL_SUPPLIERS_COLUMNS = ['id', 'contactname', 'companyname'];

/**
 * Retrieve a collection of all Supplier records from the database
 * @return {Promise<Supplier[]>}
 */
export async function getAllSuppliers() {
  const db = await getDb();
  let productList = '';

  switch (process.env.DB_TYPE) {
    case 'mysql':
      productList = sql`group_concat(p.productname ORDER BY p.productname ASC SEPARATOR ', ')`;
      break;
    case 'pg':
      productList = sql`string_agg(p.productname, ', ')`;
      break;
    case 'sqlite':
    default:
      productList = sql`group_concat(p.productname, ', ')`;
      break;
  }

  return await db.all(sql`
SELECT ${ALL_SUPPLIERS_COLUMNS.map(x => `s.${x}`).join(',')},
  ${productList} AS productlist
FROM Supplier AS s
LEFT JOIN (SELECT * FROM Product ORDER BY productname ASC) AS p ON p.supplierid = s.id
GROUP BY s.id`);
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
