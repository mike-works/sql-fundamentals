import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export async function getSearchResults(term: string): Promise<any[]> {
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
