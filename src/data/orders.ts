import * as sqlite from 'sqlite';
import { getDb } from '../db/utils';
import { logger } from '../log';
import { sql } from '../sql-string';

const ALL_ORDERS_COLUMNS = ['*'];
const ORDER_COLUMNS = ['*'];

interface AllOrdersOptions {
  page?: number;
  perPage?: number;
  order?: 'asc' | 'desc';
  sort?: string;
}

export async function getAllOrders(
  { page = 1, perPage = 20, sort = 'Id', order = 'asc' }: AllOrdersOptions = {
    order: 'asc',
    page: 1,
    perPage: 20,
    sort: 'Id'
  }
): Promise<Order[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.join(',')}
FROM "Order"`);
}

export async function getCustomerOrders(
  customerId: string,
  { page = 1, perPage = 20, sort = 'ShippedDate', order = 'asc' }: AllOrdersOptions = {
    order: 'asc',
    page: 1,
    perPage: 20,
    sort: 'ShippedDate'
  }
) {
  return getAllOrders({ page, perPage, sort, order });
}

export async function getOrder(id: string | number): Promise<Order> {
  const db = await getDb('dev');
  return await db.get(sql`
SELECT *
FROM "Order"
WHERE Id = ${id}
`);
}

export async function getOrderDetails(orderId: string | number): Promise<OrderDetail[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT *, UnitPrice * Quantity as Price
FROM "OrderDetail"
WHERE OrderId = ${orderId}
`);
}

export async function getOrderWithDetails(id: string | number): Promise<[Order, OrderDetail[]]> {
  let order = await getOrder(id);
  let items = await getOrderDetails(id);
  return [order, items];
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  return Promise.reject('Orders#createOrder() NOT YET IMPLEMENTED');
}

export async function deleteOrder(id: string | number): Promise<void> {
  return Promise.reject('Orders#deleteOrder() NOT YET IMPLEMENTED');
}
