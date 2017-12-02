import * as sqlite from 'sqlite';
import { getDb } from '../db/utils';

const ALL_ORDERS_COLUMNS = ['*'];

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
  return await db.all(`
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

export async function getOrder(id: string | number): Promise<Order[]> {
  const db = await getDb('dev');
  return await db.get(
    `
SELECT *
FROM "Order"
WHERE Id = $1
`,
    id
  );
}
