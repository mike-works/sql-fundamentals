import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Get data for the employee sales leaderboard on the dashboard page
 */
export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`
SELECT (e.firstname || ' ' || e.lastname) AS name, sum((od.unitprice * od.quantity))as amount
FROM Employee AS e
INNER JOIN CustomerOrder AS o
    ON o.employeeid = e.id
INNER JOIN OrderDetail AS od
    ON o.id = od.orderid
GROUP BY  e.id
ORDER BY  amount DESC LIMIT 5`);
}

/**
 * Get data for the customer sales leaderboard on the dashboard page
 */
export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`
SELECT c.companyname AS name,
         sum((od.unitprice * od.quantity))as amount
FROM Customer AS c
INNER JOIN CustomerOrder AS o
    ON o.customerid = c.id
INNER JOIN OrderDetail AS od
    ON o.id = od.orderid
GROUP BY  c.id
ORDER BY  amount DESC LIMIT 5`);
}

/**
 * Get data for the product sales leaderboard on the dashboard page
 */
export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`
SELECT p.productname AS name,
         sum(od.unitprice * od.quantity) AS amount
FROM OrderDetail AS od
INNER JOIN CustomerOrder AS o
    ON od.orderid = o.id
INNER JOIN Product AS p
    ON od.productid = p.id
GROUP BY  p.id
ORDER BY  amount DESC LIMIT 5`);
}

/**
 * Get data for the recent sales list the dashboard page
 */
export async function getRecentOrders() {
  let db = await getDb();
  return await db.all(sql`
SELECT o.id,
         (e.firstname || ' ' || e.lastname) AS employee, c.companyname AS customer, o.orderdate, sum(od.unitprice * od.quantity) AS subtotal
FROM CustomerOrder AS o
INNER JOIN OrderDetail AS od
    ON od.orderid = o.id
INNER JOIN Employee AS e
    ON o.employeeid = e.id
INNER JOIN Customer AS c
    ON o.customerid = c.id
WHERE o.orderdate IS NOT NULL
GROUP BY  o.id, e.firstname, e.lastname, c.companyname
ORDER BY  o.orderdate DESC LIMIT 5`);
}

/**
 * Get data for the reorder list on the dashboard page
 */
export async function getReorderList() {
  let db = await getDb();
  return await db.all(sql`
SELECT productname AS name,
         reorderlevel,
         unitsinstock,
         unitsonorder
FROM Product
WHERE (unitsinstock + unitsonorder) < reorderlevel`);
}
