import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT (e.firstname || ' ' || e.lastname) as name, sum((od.unitprice * od.quantity))as amount FROM 
  Employee as e INNER JOIN "order" as o
  ON o.employeeid = e.id
  INNER JOIN OrderDetail as od
  ON o.id = od.orderid
  GROUP BY e.id
  ORDER BY amount desc
  LIMIT 5
`);
}

export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT c.companyname as name, sum((od.unitprice * od.quantity))as amount FROM
  Customer as c INNER JOIN "order" as o
  ON o.customerid = c.id
  INNER JOIN OrderDetail as od
  ON o.id = od.orderid
  GROUP BY c.id
  ORDER BY amount desc
  LIMIT 5
`);
}

export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT p.productname as name, sum(od.unitprice * od.quantity) as amount
FROM
  OrderDetail AS od
  INNER JOIN "order" AS o ON od.orderid = o.id
  INNER JOIN Product AS p ON od.productid = p.id
GROUP BY p.id
ORDER BY amount DESC
LIMIT 5`);
}

export async function getReorderList() {
  let db = await getDb();
  return await db.all(
    sql`SELECT productname as name, reorderlevel, unitsinstock, unitsonorder from Product WHERE (unitsinstock + unitsonorder) < reorderlevel`
  );
}
