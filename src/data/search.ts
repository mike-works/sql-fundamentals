import { getDb, DbType, DB_TYPE } from '../db/utils';
import { sql } from '../sql-string';

async function getPgSearchResults(term: string): Promise<any[]> {
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

async function getMySQLSearchResults(term: string): Promise<any[]> {
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

async function getSQLiteSearchResults(term: string): Promise<any[]> {
  let db = await getDb();
  return db.all(
    sql`
SELECT * from
(SELECT 'product' as entity, productname as name, productname as the_text, ('' || id) as id FROM Product
	UNION
SELECT 'supplier' as entity, companyname as name, companyname as the_text, ('' || id) as id FROM Supplier
	UNION
SELECT 'customer' as entity, companyname as name, companyname as the_text, ('' || id) as id FROM Customer
 	UNION
SELECT 'category' as entity, categoryname as name, categoryname as the_text, ('' || id) as id FROM Category
 	UNION
 SELECT 'employee' as entity, (firstname || ' ' || lastname) as name, (firstname || ' ' || lastname) as the_text, ('' || id) as id FROM Employee
) as a
WHERE lower(a.the_text) LIKE $1`,
    `%${term}%`
  );
}

export async function getSearchResults(term: string): Promise<any[]> {
  switch (DB_TYPE) {
    case DbType.Postgres:
      return await getPgSearchResults(term);
    case DbType.MySQL:
      return await getMySQLSearchResults(term);
    case DbType.SQLite:
      return await getSQLiteSearchResults(term);
    default:
      throw new Error(`Unknown DB type: ${DbType[DB_TYPE]}`);
  }
}
