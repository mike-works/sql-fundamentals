import { ORDER_COLUMNS } from '../data/orders';
import { sql } from '../sql-string';
import { SQLDatabase, SQLStatement } from './db';

export async function setupPreparedStatements<
  S extends SQLStatement,
  D extends SQLDatabase<S>
>(db: D): Promise<{ [k: string]: S }> {
  let getOrder = await db.prepare(
    'getOrder',
    sql`
  SELECT ${ORDER_COLUMNS.map(c => `o.${c}`).join(',')},
    c.companyname as customername,
    (e.firstname || ' ' || e.lastname) as employeename,
    sum(od.unitprice * od.quantity) as subtotalprice
  FROM "order" as o
  LEFT JOIN Customer as c
    ON o.customerid = c.id
  LEFT JOIN Employee as e
    ON o.employeeid = e.id
  LEFT JOIN OrderDetail as od
    ON od.orderid=o.id
  WHERE o.id = $1
  GROUP BY o.id, c.companyname, e.firstname, e.lastname
  `
  );
  return { getOrder };
}
