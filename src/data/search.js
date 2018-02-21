import { getDb, DbType, DB_TYPE } from '../db/utils';
import { sql } from '../sql-string';

/**
 * @typedef SearchResult
 * @property {string} entity
 * @property {string} name
 * @property {string|number} id
 */

/**
 *
 *
 * @param {string} term
 * @returns {Promise<SearchResult[]>}
 */
async function getPgSearchResults(term) {
  let db = await getDb();
  return db.all(
    sql`SELECT * FROM (SELECT 'product' as entity, productname as name, ('' || id) as id, ts_rank_cd(to_tsvector(productname || ' ' || quantityperunit), query, 32) AS rank
FROM Product, to_tsquery($1) query
WHERE to_tsvector(productname || ' ' || quantityperunit) @@ query
UNION
SELECT 'supplier' as entity, companyname as name, ('' || id) as id, ts_rank_cd(to_tsvector(contactname || ' ' || companyname || ' ' || country || ' ' || city), query, 32) AS rank
FROM Supplier, to_tsquery($1) query
WHERE to_tsvector(contactname || ' ' || companyname || ' ' || country || ' ' || city) @@ query
UNION
SELECT 'customer' as entity, companyname as name, ('' || id) as id, ts_rank_cd(to_tsvector(contactname || ' ' || companyname || ' ' || country || ' ' || city), query, 32) AS rank
FROM Customer, to_tsquery($1) query
WHERE to_tsvector(contactname || ' ' || companyname || ' ' || country || ' ' || city) @@ query
UNION
SELECT 'employee' as entity, (firstname || ' ' || lastname ) as name, ('' || id) as id, ts_rank_cd(to_tsvector(firstname || ' ' || lastname || ' ' || title || ' ' || notes), query, 32) AS rank
FROM Employee, to_tsquery($1) query
  WHERE to_tsvector(firstname || ' ' || lastname || ' ' || title || ' ' || notes) @@ query) as n ORDER BY rank`,
    `${term}:*`
  );
}

/**
 *
 *
 * @param {string} term
 * @returns {Promise<any[]>}
 */
async function getMySQLSearchResults(term) {
  let db = await getDb();
  return db.all(sql`
    SELECT 'employee' AS entity, ('' || id) AS id, CONCAT(firstname, ' ', lastname) AS name
      FROM Employee
      WHERE MATCH (firstname,lastname,title,notes,country) AGAINST ('${term}*' IN BOOLEAN MODE )
    UNION
    SELECT 'product' AS entity, ('' || id) AS id, productname AS name
      FROM Product
      WHERE MATCH (productname, quantityperunit) AGAINST ('${term}*' IN BOOLEAN MODE )
    UNION
    SELECT 'supplier' AS entity, ('' || id) AS id, companyname AS name
      FROM Supplier
      WHERE MATCH (contactname,companyname,country,city) AGAINST ('${term}*' IN BOOLEAN MODE )
    UNION
    SELECT 'customer' AS entity, ('' || id) AS id, companyname AS name
      FROM Customer
      WHERE MATCH (contactname,companyname,country,city) AGAINST ('${term}*' IN BOOLEAN MODE )
    `);
}

/**
 *
 *
 * @param {string} term
 * @returns {Promise<any[]>}
 */
async function getSQLiteSearchResults(term) {
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

/**
 * Retrieve a list of search results from the database
 * @param {string} term search term
 * @returns {Promise<any[]>}
 */
export async function getSearchResults(term) {
  switch (DB_TYPE) {
    case DbType.PostgreSQL:
      return await getPgSearchResults(term);
    case DbType.MySQL:
      return await getMySQLSearchResults(term);
    case DbType.SQLite:
      return await getSQLiteSearchResults(term);
    default:
      throw new Error(`Unknown DB type: ${DbType[DB_TYPE]}`);
  }
}
