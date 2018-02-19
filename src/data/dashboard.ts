import { getDb, DbType, DB_TYPE } from '../db/utils';
import { sql } from '../sql-string';

const VIEW_NAMES = Object.freeze(
  // tslint:disable-next-line:only-arrow-functions
  (function(dbType) {
    switch (dbType) {
      case DbType.Postgres:
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

export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.employeeLeaderboard}`);
}

export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.customerLeaderboard}`);
}

export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.productLeaderboard}`);
}

export async function getRecentOrders() {
  let db = await getDb();
  return await db.all(sql`SELECT * from ${VIEW_NAMES.recentOrders}`);
}

export async function getReorderList() {
  let db = await getDb();
  return await db.all(
    sql`SELECT productname as name, reorderlevel, unitsinstock, unitsonorder from Product WHERE (unitsinstock + unitsonorder) < reorderlevel`
  );
}
