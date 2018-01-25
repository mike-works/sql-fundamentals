import { getDb } from '../db/utils';
import { sql } from '../sql-string';
import { sqlFormat } from '../utils';

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
  'requireddate',
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
    sortClause = sql`ORDER BY o.${sort} ${order.toUpperCase()}`;
  }
  return await db.all(sql`
SELECT ${ALL_ORDERS_COLUMNS.map(c => `o.${c}`).join(',')},
  c.companyname as customername,
  (e.firstname || ' ' || e.lastname) as employeename
FROM "order" as o
LEFT JOIN Customer as c
  ON o.customerid = c.id
LEFT JOIN Employee as e
  ON o.employeeid = e.id
${sortClause} ${paginationClause}
`);
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
    sortClause = sql`ORDER BY o.${sort} ${order.toUpperCase()}`;
  }
  return await db.all(
    sql`
SELECT ${CUSTOMER_ORDERS_COLUMNS.map(c => `o.${c}`).join(',')},
  (e.firstname || ' ' || e.lastname) as employeename
FROM "order" as o
LEFT JOIN Employee as e
  ON o.employeeid = e.id
WHERE o.customerid = $1
 ${sortClause} ${paginationClause}
`,
    customerId
  );
}

export async function getOrder(id: string | number): Promise<Order> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT ${ORDER_COLUMNS.map(c => `o.${c}`).join(',')},
  c.companyname as customername,
  (e.firstname || ' ' || e.lastname) as employeename,
  sum(od.unitprice * od.quantity) as subtotalprice
FROM "order" as o
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
): Promise<{ id: number | string }> {
  const db = await getDb();
  await db.run(sql`BEGIN`);
  try {
    let s = await db.run(
      sql`
INSERT INTO "order"
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
    let orderId = s.lastID;
    for (let i = 0; i < details.length; i++) {
      let detail = details[i];
      await db.run(
        sql`INSERT INTO OrderDetail (id, orderid, productid, unitprice, discount, quantity) VALUES ($1, $2, $3, $4, $5, $6)`,
        `${orderId}/${i}`,
        orderId,
        detail.productid,
        detail.unitprice,
        detail.discount,
        detail.quantity
      );
    }
    await db.run(sql`COMMIT`);
    return Object.assign({ id: orderId }, order);
  } catch (e) {
    await db.run(sql`ROLLBACK`);
    throw e;
  }
}

export async function deleteOrder(id: string | number): Promise<void> {
  const db = await getDb();
  await db.run(sql`DELETE FROM "order" WHERE id=$1;`, id);
}

export async function updateOrder(
  id: string | number,
  data: Partial<Order>,
  details: Array<Partial<OrderDetail>> = []
): Promise<{ id: number | string }> {
  const db = await getDb();
  await db.run(sql`BEGIN`);
  try {
    let updates: string[] = [];
    for (let i in data) {
      if (data.hasOwnProperty(i) && typeof (data as any)[i] !== 'object') {
        updates.push(`${i}=${sqlFormat(data[i as keyof Order])}`);
      }
    }
    let query = sql`UPDATE "order"
  SET ${updates.join(', ')}
  WHERE id=$1;`;
    await db.run(query, id);
    for (let detail of details) {
      let detailUpdates: string[] = [];
      for (let di in detail) {
        if (detail.hasOwnProperty(di) && di !== 'id' && di !== 'price') {
          detailUpdates.push(
            `${di}=${sqlFormat(detail[di as keyof OrderDetail])}`
          );
        }
      }
      await db.run(
        sql`UPDATE OrderDetail SET ${detailUpdates.join(', ')} WHERE id=$1`,
        detail.id
      );
    }
    await db.run(sql`COMMIT`);
    return { id };
  } catch (e) {
    await db.run(sql`ROLLBACK`);
    throw e;
  }
}
