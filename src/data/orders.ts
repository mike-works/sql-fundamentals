import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export const ALL_ORDERS_COLUMNS = ['*'];
export const ORDER_COLUMNS = ['*'];

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
  {
    page = 1,
    perPage = 20,
    sort = 'shippeddate',
    order = 'asc'
  }: AllOrdersOptions = {
    order: 'asc',
    page: 1,
    perPage: 20,
    sort: 'shippeddate'
  }
) {
  return getAllOrders({ page, perPage, sort, order });
}

export async function getOrder(id: string | number): Promise<Order> {
  const db = await getDb('dev');
  return await db.get(
    sql`
SELECT *
FROM "Order"
WHERE Id = $1`,
    id
  );
}

export async function getOrderDetails(
  orderId: string | number
): Promise<OrderDetail[]> {
  const db = await getDb('dev');
  return await db.all(
    sql`
SELECT *, UnitPrice * Quantity as Price
FROM OrderDetail
WHERE OrderId = $1`,
    orderId
  );
}

export async function getOrderWithDetails(
  id: string | number
): Promise<[Order, OrderDetail[]]> {
  let order = await getOrder(id);
  let items = await getOrderDetails(id);
  return [order, items];
}

export async function createOrder(
  order: Partial<Order>,
  details: Array<Partial<OrderDetail>> = []
): Promise<Partial<Order>> {
  return Promise.reject('Orders#createOrder() NOT YET IMPLEMENTED');
}

export async function deleteOrder(id: string | number): Promise<void> {
  return Promise.reject('Orders#deleteOrder() NOT YET IMPLEMENTED');
}

export async function updateOrder(
  id: string | number,
  data: Partial<Order>,
  details: Array<Partial<OrderDetail>> = []
): Promise<Partial<Order>> {
  return Promise.reject('Orders#updateOrder() NOT YET IMPLEMENTED');
}
