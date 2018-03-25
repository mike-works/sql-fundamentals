import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export const ALL_ORDERS_COLUMNS = [
  'id',
  'customerid',
  'employeeid',
  'shipcity',
  'shipcountry',
  'shippeddate'
];
export const ORDER_COLUMNS = ['*'];

/**
 * @typedef OrderCollectionOptions
 * @property {number} page Page number (zero-indexed)
 * @property {number} perPage Results per page
 * @property {string} sort Property to sort by
 * @property {'asc'|'desc'} order Sort direction
 * @description Options that may be used to customize a query for a collection of CustomerOrder records
 */

/**
 * Defaults values to use when parts of OrderCollectionOptions are not provided
 * @type {Readonly<OrderCollectionOptions>}
 */
const DEFAULT_ORDER_COLLECTION_OPTIONS = Object.freeze(
  /** @type {OrderCollectionOptions}*/ ({
    order: 'asc',
    page: 1,
    perPage: 20,
    sort: 'id'
  })
);

/**
 * @param {Partial<OrderCollectionOptions>} opts Options for customizing the query
 * @param {string} whereClause
 * @returns {Promise<Order[]>} the orders
 */
async function getAllOrdersBase(opts, whereClause) {
  // Combine the options passed into the function with the defaults
  let options = { ...DEFAULT_ORDER_COLLECTION_OPTIONS, ...opts };
  let { page, perPage, sort, order } = options;
  let offsetClause = '';
  if (typeof page !== 'undefined' && typeof perPage !== 'undefined') {
    offsetClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;
  }
  if (!opts.sort) {
    opts.sort = 'shippeddate';
    opts.order = 'asc';
  }
  let orderClause = '';
  if (typeof sort !== 'undefined' && typeof order !== 'undefined') {
    orderClause = sql`ORDER BY o.${sort} ${order.toUpperCase()}`;
  }
  // SOLUTION FOR EXERCISE 1 GOES HERE //
  const db = await getDb();
  /*
  SELECT o.id,
         o.customerid,
         o.amount,
         c.name
FROM CustomerOrder AS o
INNER JOIN Customer AS c
    ON o.customerid = c.id
   */
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.map(col => `o.${col}`).join(
    ','
  )}, c.companyname, e.firstname, e.lastname
FROM CustomerOrder AS o
INNER JOIN Customer AS c 
  ON o.customerid = c.id
INNER JOIN Employee AS e
  ON o.employeeid = e.id
${orderClause}
${offsetClause}`);
}

/**
 * Retrieve a collection of "all orders" from the database.
 * NOTE: This table has tens of thousands of records, so we'll probably have to apply
 *    some strategy for viewing only a part of the collection at any given time
 * @param {Partial<OrderCollectionOptions>} opts Options for customizing the query
 * @returns {Promise<Order[]>} the orders
 */
export async function getAllOrders(opts = {}) {
  return getAllOrdersBase(opts, '');
}

/**
 * Retrieve a list of CustomerOrder records associated with a particular Customer
 * @param {string} customerId Customer id
 * @param {Partial<OrderCollectionOptions>} opts Options for customizing the query
 */
export async function getCustomerOrders(customerId, opts = {}) {
  if (!opts.sort) {
    opts.sort = 'shippeddate';
    opts.order = 'desc';
  }
  return getAllOrdersBase(opts, ``);
}

/**
 * Retrieve an individual CustomerOrder record by id
 * @param {string | number} id CustomerOrder id
 * @returns {Promise<Order>} the order
 */
export async function getOrder(id) {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *, c.companyname, (e.firstname || ' '  || e.lastname) as employeename, sum(od.unitprice * od.quantity) AS subtotalprice
FROM CustomerOrder AS co
INNER JOIN Customer AS c
    ON co.customerid = c.id
INNER JOIN Employee AS e
    ON co.employeeid = e.id
INNER JOIN OrderDetail AS od
    ON co.id = od.orderid
WHERE co.id = $1
GROUP BY co.id`,
    id
  );
}

/**
 * Get the OrderDetail records associated with a particular CustomerOrder record
 * @param {string | number} id CustomerOrder id
 * @returns {Promise<OrderDetail[]>} the order details
 */
export async function getOrderDetails(id) {
  const db = await getDb();
  return await db.all(
    sql`
SELECT od.*, od.unitprice * od.quantity as price, p.productname
FROM OrderDetail AS od
LEFT JOIN Product AS p
  ON od.productid = p.id
WHERE od.orderid = $1`,
    id
  );
}

/**
 * Get a CustomerOrder record, and its associated OrderDetails records
 * @param {string | number} id CustomerOrder id
 * @returns {Promise<[Order, OrderDetail[]]>} the order and respective order details
 */
export async function getOrderWithDetails(id) {
  let order = await getOrder(id);
  let items = await getOrderDetails(id);
  return [order, items];
}

/**
 * Create a new CustomerOrder record
 * @param {Pick<Order, 'employeeid' | 'customerid' | 'shipcity' | 'shipaddress' | 'shipname' | 'shipvia' | 'shipregion' | 'shipcountry' | 'shippostalcode' | 'requireddate' | 'freight'>} order data for the new CustomerOrder
 * @param {Array<Pick<OrderDetail, 'productid' | 'quantity' | 'unitprice' | 'discount'>>} details data for any OrderDetail records to associate with this new CustomerOrder
 * @returns {Promise<Order>} the newly created order
 */
export async function createOrder(order, details = []) {
  return Promise.reject('Orders#createOrder() NOT YET IMPLEMENTED');
}

/**
 * Delete a CustomerOrder from the database
 * @param {string | number} id CustomerOrder id
 * @returns {Promise<void>}
 */
export async function deleteOrder(id) {
  return Promise.reject('Orders#deleteOrder() NOT YET IMPLEMENTED');
}

/**
 * Update a CustomerOrder, and its associated OrderDetail records
 * @param {string | number} id CustomerOrder id
 * @param {Pick<Order, 'employeeid' | 'customerid' | 'shipcity' | 'shipaddress' | 'shipname' | 'shipvia' | 'shipregion' | 'shipcountry' | 'shippostalcode' | 'requireddate' | 'freight'>} data data for the new CustomerOrder
 * @param {Array<Pick<OrderDetail, 'id' | 'productid' | 'quantity' | 'unitprice' | 'discount'>>} details data for any OrderDetail records to associate with this new CustomerOrder
 * @returns {Promise<Partial<Order>>} the order
 */
export async function updateOrder(id, data, details = []) {
  return Promise.reject('Orders#updateOrder() NOT YET IMPLEMENTED');
}
