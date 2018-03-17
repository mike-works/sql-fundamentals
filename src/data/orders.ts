import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export const ALL_ORDERS_COLUMNS = ['*'];
export const ORDER_COLUMNS = ['*'];

/**
 * Options that may be used to customize a query for a collection of CustomerOrder records
 */
interface OrderCollectionOptions {
  /** Page number (zero-indexed) */
  page: number;
  /** Results per page */
  perPage: number;
  /** Property to sort result set by */
  sort: string;
  /** Direction of sort */
  order: 'asc' | 'desc';
}

/**
 * Defaults values to use when parts of OrderCollectionOptions are not provided
 */
const DEFAULT_ORDER_COLLECTION_OPTIONS: Readonly<OrderCollectionOptions> = Object.freeze({
  order: 'asc',
  page: 1,
  perPage: 20,
  sort: 'id'
} as OrderCollectionOptions);

/**
 * Retrieve a collection of "all orders" from the database.
 * NOTE: This table has tens of thousands of records, so we'll probably have to apply
 *    some strategy for viewing only a part of the collection at any given time
 * @param opts Options for customizing the query
 */
export async function getAllOrders(opts: Partial<OrderCollectionOptions> = {}): Promise<Order[]> {
  // Combine the options passed into the function with the defaults
  let options: OrderCollectionOptions = {
    ...DEFAULT_ORDER_COLLECTION_OPTIONS,
    ...opts
  };

  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.join(',')}
FROM CustomerOrder`);
}

/**
 * Retrieve a list of CustomerOrder records associated with a particular Customer
 * @param customerId Customer id
 * @param opts Options for customizing the query
 */
export async function getCustomerOrders(
  customerId: string,
  opts: Partial<OrderCollectionOptions> = {}
) {
  // ! This is going to retrieve ALL ORDERS, not just the ones that belong to a particular customer. We'll need to fix this
  return getAllOrders(opts);
}

/**
 * Retrieve an individual CustomerOrder record by id
 * @param id CustomerOrder id
 */
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

/**
 * Get the OrderDetail records associated with a particular CustomerOrder record
 * @param id CustomerOrder id
 */
export async function getOrderDetails(id: string | number): Promise<OrderDetail[]> {
  const db = await getDb();
  return await db.all(
    sql`
SELECT *, unitprice * quantity as price
FROM OrderDetail
WHERE orderid = $1`,
    id
  );
}

/**
 * Get a CustomerOrder record, and its associated OrderDetails records
 * @param id CustomerOrder id
 */
export async function getOrderWithDetails(id: string | number): Promise<[Order, OrderDetail[]]> {
  let order = await getOrder(id);
  let items = await getOrderDetails(id);
  return [order, items];
}

/**
 * Create a new CustomerOrder record
 * @param order data for the new CustomerOrder
 * @param details data for any OrderDetail records to associate with this new CustomerOrder
 * TODO: convert Partial<Order> to Pick<Order>
 */
export async function createOrder(
  order: Partial<Order>,
  details: Array<Partial<OrderDetail>> = []
): Promise<Partial<Order>> {
  return Promise.reject('Orders#createOrder() NOT YET IMPLEMENTED');
}

/**
 * Delete a CustomerOrder from the database
 * @param id CustomerOrder id
 */
export async function deleteOrder(id: string | number): Promise<void> {
  return Promise.reject('Orders#deleteOrder() NOT YET IMPLEMENTED');
}

/**
 * Update a CustomerOrder, and its associated OrderDetail records
 * @param id CustomerOrder id
 * @param data new data for the CustomerOrder
 * @param details data for updating any associated OrderDetail records
 */
export async function updateOrder(
  id: string | number,
  data: Partial<Order>,
  details: Array<Partial<OrderDetail>> = []
): Promise<Partial<Order>> {
  return Promise.reject('Orders#updateOrder() NOT YET IMPLEMENTED');
}
