import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * @typedef SearchResult
 * @property {string} entity
 * @property {string} name
 * @property {string|number} id
 */

/**
 * Retrieve a list of search results from the database
 * @param {string} term search term
 * @returns {Promise<SearchResult[]>} search results
 */
export async function getSearchResults(term) {
  let db = await getDb();
  return db.all(
    sql`
SELECT * FROM
(SELECT 'product' AS entity, productname AS name, productname AS the_text, ('' || id) AS id FROM Product
	UNION
SELECT 'supplier' AS entity, companyname AS name, companyname AS the_text, ('' || id) AS id FROM Supplier
	UNION
SELECT 'customer' AS entity, companyname AS name, companyname AS the_text, ('' || id) AS id FROM Customer
 	UNION
SELECT 'category' AS entity, categoryname AS name, categoryname AS the_text, ('' || id) AS id FROM Category
 	UNION
 SELECT 'employee' AS entity, (firstname || ' ' || lastname) AS name, (firstname || ' ' || lastname) AS the_text, ('' || id) AS id FROM Employee
) AS a
WHERE lower(a.the_text) LIKE $1`,
    `%${term}%`
  );
}
