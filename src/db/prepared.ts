import { ORDER_COLUMNS } from '../data/orders';
import { sql } from '../sql-string';
import { SQLDatabase, SQLPreparedStatement } from './db';

interface PreparedStatementMap {
  [k: string]: SQLPreparedStatement;
}

/**
 * Initialize client-side prepared statements as part
 * of creating a new database connection
 * @param db A PostgreSQL, SQLite or MySQL Database connection
 * @returns {Promise<PreparedStatementMap>}
 */
export async function setupPreparedStatements(db: SQLDatabase): Promise<PreparedStatementMap> {
  /**
   * Replace the body of this function with something that returns
   * an object whose keys are strings and values are prepared statements
   *
   * @example
   *
   *    return {
   *      getOrder: <a prepared statement>
   *    }
   *
   */
  let getOrder = await db.prepare(
    'getOrder',
    sql`
  SELECT ${ORDER_COLUMNS.map(c => `o.${c}`).join(',')},
    c.companyname as customername,
    e.lastname as employeename,
    sum(od.unitprice * od.quantity) as subtotal
  FROM CustomerOrder as o
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
