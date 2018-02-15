import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export const ALL_ORDERS_COLUMNS = ['*'];
export const ORDER_COLUMNS = ['*'];

interface OrderCollectionOptions {
  page: number;
  perPage: number;
  order: 'asc' | 'desc';
  sort: string;
}

const DEFAULT_ORDER_COLLECTION_OPTIONS: OrderCollectionOptions = {
  order: 'asc',
  page: 1,
  perPage: 20,
  sort: 'id'
};

export async function getAllOrders(
  opts: Partial<OrderCollectionOptions> = DEFAULT_ORDER_COLLECTION_OPTIONS
): Promise<Order[]> {
  let options: OrderCollectionOptions = {
    ...DEFAULT_ORDER_COLLECTION_OPTIONS,
    ...opts
  };
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.join(',')}
FROM "order"`);
}

export async function getCustomerOrders(
  customerId: string,
  opts: OrderCollectionOptions = DEFAULT_ORDER_COLLECTION_OPTIONS
) {
  return getAllOrders(opts);
}

export async function getOrder(id: string | number): Promise<Order> {
  const db = await getDb('dev');
  return await db.get(
    sql`
SELECT *
FROM "order"
WHERE id = $1`,
    id
  );
}

export async function getOrderDetails(
  id: string | number
): Promise<OrderDetail[]> {
  const db = await getDb('dev');
  return await db.all(
    sql`
SELECT *, unitprice * quantity as price
FROM OrderDetail
WHERE orderid = $1`,
    id
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
