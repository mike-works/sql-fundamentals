import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to SELECT for the getAllCustomers query
 */
const ALL_CUSTOMERS_COLUMNS = ['*'];

/**
 * Options that may be used to customize a query for a collection of Customers
 *
 * @interface CustomerCollectionOptions
 */
interface CustomerCollectionOptions {
  filter?: string;
}

/**
 * Retrieve an array of Customers from the database
 *
 * @export
 * @param {CustomerCollectionOptions} [options={}] Options that influence the particulars of the "all customers" query
 * @returns {Promise<Customer[]>} A collection of customers
 */
export async function getAllCustomers(
  options: CustomerCollectionOptions = {}
): Promise<Customer[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_CUSTOMERS_COLUMNS.join(',')}
FROM Customer`);
}

/**
 * Retrieve an individual Customer (by Id) from the database
 *
 * @export
 * @param {(string | number)} id The id of the customer to retrieve
 * @returns {Promise<Customer>} The customer
 */
export async function getCustomer(id: string | number): Promise<Customer> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *
FROM Customer
WHERE id = $1`,
    id
  );
}
