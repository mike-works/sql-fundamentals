import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export async function getEmployeeSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from "employee_leaderboard"`);
}

export async function getCustomerSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from "customer_leaderboard"`);
}

export async function getProductSalesLeaderboard() {
  let db = await getDb();
  return await db.all(sql`SELECT * from "product_leaderboard"`);
}

export async function getRecentOrders() {
  let db = await getDb();
  return await db.all(sql`SELECT * from "recent_orders"`);
}

export async function getReorderList() {
  let db = await getDb();
  return await db.all(
    sql`SELECT productname as name, reorderlevel, unitsinstock, unitsonorder from Product WHERE (unitsinstock + unitsonorder) < reorderlevel`
  );
}
