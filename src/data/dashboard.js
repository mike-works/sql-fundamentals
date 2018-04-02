import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Get data for the employee sales leaderboard on the dashboard page
 */
export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * FROM MV_EmployeeLeaderboard;`);
}

/**
 * Get data for the customer sales leaderboard on the dashboard page
 */
export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * FROM MV_CustomerLeaderboard;`);
}

/**
 * Get data for the product sales leaderboard on the dashboard page
 */
export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * FROM MV_ProductLeaderboard;`);
}

/**
 * Get data for the recent sales list the dashboard page
 */
export async function getRecentOrders() {
  let db = await getDb();
  return await db.all(sql`SELECT * FROM MV_RecentOrders;`);
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
