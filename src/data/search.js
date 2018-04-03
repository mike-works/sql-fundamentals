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
(SELECT 
	'product' AS entity,
	productname AS name,
	ts_rank_cd(Product.fts,query, 32) as rank,
	('' || id) AS id
FROM Product, to_tsquery($1) query
WHERE fts @@ query
ORDER BY rank DESC) UNION
(SELECT 
	'employee' AS entity,
	(firstname || ' ' || lastname) AS name,
	ts_rank_cd(Employee.fts,query, 32) as rank,
	('' || id) AS id
FROM Employee, to_tsquery($1) query
WHERE fts @@ query
ORDER BY rank DESC) UNION
(SELECT 
	'customer' AS entity,
	contactname AS name,
	ts_rank_cd(Customer.fts,query, 32) as rank,
	('' || id) AS id
FROM Customer, to_tsquery($1) query
WHERE fts @@ query
ORDER BY rank DESC) UNION (SELECT 
	'supplier' AS entity,
	companyname AS name,
	ts_rank_cd(Supplier.fts,query, 32) as rank,
	('' || id) AS id
FROM Supplier, to_tsquery($1) query
WHERE fts @@ query
ORDER BY rank DESC)`,
    `${term}:*`
  );
}
