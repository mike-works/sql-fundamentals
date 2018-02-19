import { getDb, DbType, DB_TYPE } from '../db/utils';
import { sql } from '../sql-string';

const VIEW_NAMES = Object.freeze(
  // tslint:disable-next-line:only-arrow-functions
  (function(dbType) {
    switch (dbType) {
      case DbType.PostgreSQL:
        return {
          employeeLeaderboard: 'MV_EmployeeLeaderboard',
          customerLeaderboard: 'MV_CustomerLeaderboard',
          productLeaderboard: 'MV_ProductLeaderboard',
          recentOrders: 'MV_RecentOrders'
        };
      default:
        return {
          employeeLeaderboard: 'V_EmployeeLeaderboard',
          customerLeaderboard: 'V_CustomerLeaderboard',
          productLeaderboard: 'V_ProductLeaderboard',
          recentOrders: 'V_RecentOrders'
        };
    }
  })(DB_TYPE)
);

/**
 * Get data for the employee sales leaderboard on the dashboard page
 */
export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.employeeLeaderboard}`);
}

/**
 * Get data for the customer sales leaderboard on the dashboard page
 */
export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.customerLeaderboard}`);
}

/**
 * Get data for the product sales leaderboard on the dashboard page
 */
export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.productLeaderboard}`);
}

/**
 * Get data for the recent sales list the dashboard page
 */
export async function getRecentOrders() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.recentOrders}`);
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
