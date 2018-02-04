import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export const ALL_ORDERS_COLUMNS = [
  'id',
  'customerid',
  'employeeid',
  'shipcity',
  'orderdate',
  'shipcountry'
];

export const ORDER_COLUMNS = [
  ...ALL_ORDERS_COLUMNS,
  'shipname',
  'shipaddress',
  'shippostalcode',
  'shipcountry',
  'freight'
];

const CUSTOMER_ORDERS_COLUMNS = [
  'id',
  'customerid',
  'employeeid',
  'shippeddate',
  'requireddate',
  'orderdate',
  'shipcity',
  'shipcountry'
];

interface OrderCollectionOptions {
  page: number;
  perPage: number;
  order: 'asc' | 'desc';
  sort: string;
}

const DEFAULT_ORDER_COLLECTION_OPTIONS: Readonly<
  OrderCollectionOptions
  > = Object.freeze({
    order: 'asc',
    page: 1,
    perPage: 20,
    sort: 'id'
  } as OrderCollectionOptions);

export async function getAllOrders(
  opts: Partial<OrderCollectionOptions> = {}
): Promise<Order[]> {
  let options: OrderCollectionOptions = {
    ...DEFAULT_ORDER_COLLECTION_OPTIONS,
    ...opts
  };

  const db = await getDb();
  const { order, sort, page, perPage } = options;
  let paginationClause = sql`LIMIT ${perPage} OFFSET ${perPage * (page - 1)}`;
  let sortClause = '';
  if (order) {
    sortClause = sql`ORDER BY ${sort} ${order.toUpperCase()}`;
  }
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.join(',')}
FROM CustomerOrder ${sortClause} ${paginationClause}`);
}

export async function getCustomerOrders(
  customerId: string,
  opts: Partial<OrderCollectionOptions> = {}
): Promise<Order[]> {
  const db = await getDb();
  let options: OrderCollectionOptions = {
    order: 'asc',
    page: 1,
    perPage: 20,
    sort: 'shippeddate',
    ...opts
  };
  const { order, sort, page, perPage } = options;
  let paginationClause = sql`LIMIT ${perPage} OFFSET ${perPage * (page - 1)}`;
  let sortClause = '';
  if (order) {
    sortClause = sql`ORDER BY ${sort} ${order.toUpperCase()}`;
  }
  return await db.all(
    sql`
SELECT ${CUSTOMER_ORDERS_COLUMNS.join(',')}
FROM CustomerOrder
WHERE customerid = $1
 ${sortClause} ${paginationClause}
`,
    customerId
  );
}

export async function getOrder(id: string | number): Promise<Order> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *
FROM CustomerOrder
WHERE id = $1`,
    id
  );
}

export async function getOrderDetails(
  id: string | number
): Promise<OrderDetail[]> {
  const db = await getDb();
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
