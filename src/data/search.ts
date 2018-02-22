import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export async function getSearchResults(term: string): Promise<any[]> {
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
