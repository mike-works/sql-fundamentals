import { getDb } from '../db/utils';
import { sql } from '../sql-string';

export const ALL_ORDERS_COLUMNS = [
  'id',
  'customerid',
  'employeeid',
  'shippeddate',
  'requireddate',
  'orderdate',
  'shipcity',
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
 * Retrieve a collection of "all orders" from the database.
 * NOTE: This table has tens of thousands of records, so we'll probably have to apply
 *    some strategy for viewing only a part of the collection at any given time
 * @param {Partial<OrderCollectionOptions>} opts Options for customizing the query
 * @returns {Promise<Order[]>} the orders
 */
export async function getAllOrders(opts = {}) {
  // Combine the options passed into the function with the defaults

  /** @type {OrderCollectionOptions} */
  let options = {
    ...DEFAULT_ORDER_COLLECTION_OPTIONS,
    ...opts
  };

  const db = await getDb();
  const { order, sort, page, perPage } = options;
  let paginationClause = sql`LIMIT ${perPage} OFFSET ${perPage * (page - 1)}`;
  let sortClause = '';
  if (order) {
    sortClause = sql`ORDER BY o.${sort} ${order.toUpperCase()}`;
  }
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.map(c => `o.${c}`).join(',')},
  c.companyname as customername,
  e.lastname as employeename
FROM CustomerOrder as o
LEFT JOIN Customer as c
  ON o.customerid = c.id
LEFT JOIN Employee as e
  ON o.employeeid = e.id
${sortClause} ${paginationClause}
`);
}

/**
 * Retrieve a list of CustomerOrder records associated with a particular Customer
 * @param {string} customerId Customer id
 * @param {Partial<OrderCollectionOptions>} opts Options for customizing the query
 */
export async function getCustomerOrders(customerId, opts = {}) {
  const db = await getDb();
  /** @type {OrderCollectionOptions} */
  let options = {
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
    sortClause = sql`ORDER BY o.${sort} ${order.toUpperCase()}`;
  }
  return await db.all(
    sql`
SELECT ${ALL_ORDERS_COLUMNS.map(c => `o.${c}`).join(',')},
  e.lastname as employeename
FROM CustomerOrder as o
LEFT JOIN Employee as e
  ON o.employeeid = e.id
WHERE o.customerid = $1
 ${sortClause} ${paginationClause}
`,
    customerId
  );
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
SELECT ${ORDER_COLUMNS.map(c => `o.${c}`).join(',')},
  c.companyname as customername,
  e.lastname as employeename,
  sum(od.unitprice * od.quantity) as subtotal
FROM CustomerOrder as o
LEFT JOIN Customer as c
  ON o.customerid = c.id
LEFT JOIN Employee as e
  ON o.employeeid = e.id
LEFT JOIN OrderDetail as od
  ON od.orderid=o.id
WHERE o.id=$1
GROUP BY o.id, c.companyname, e.firstname, e.lastname`,
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
LEFT JOIN Product AS p ON p.id=od.productid
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
 * @returns {Promise<{id: string}>} the newly created order
 */
export async function createOrder(order, details = []) {
  const db = await getDb();
  let s = await db.run(
    sql`
INSERT INTO CustomerOrder
  (employeeid, customerid, shipname, shipcity, shipaddress, shipvia, shipregion, shipcountry, shippostalcode, requireddate, freight)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    order.employeeid,
    order.customerid,
    order.shipname,
    order.shipcity,
    order.shipaddress,
    order.shipvia,
    order.shipregion,
    order.shipcountry,
    order.shippostalcode,
    order.requireddate,
    order.freight
  );
  if (!s || typeof s.lastID === 'undefined')
    throw new Error('No id returned from CustomerOrder insertion');
  let c = 1;
  const orderId = s.lastID;
  await Promise.all(
    details.map(d => {
      return db.run(
        sql`INSERT INTO OrderDetail(id,orderid,productid,unitprice,quantity,discount)
VALUES($1, $2, $3, $4, $5, $6);`,
        `${orderId}/${c++}`,
        orderId,
        d.productid,
        d.unitprice,
        d.quantity,
        d.discount
      );
    })
  );
  return { id: s.lastID };
}

/**
 * Delete a CustomerOrder from the database
 * @param {string | number} id CustomerOrder id
 * @returns {Promise<any>}
 */
export async function deleteOrder(id) {
  const db = await getDb();
  await db.run(sql`DELETE FROM CustomerOrder WHERE id=$1;`, id);
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
