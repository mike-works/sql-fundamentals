import * as sqlite from 'sqlite';
import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_PRODUCT_COLUMNS = ['*'];

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product
`);
}

export async function getDiscontinuedProducts(): Promise<Product[]> {
  return getAllProducts();
}

export async function getProductsNeedingReorder(): Promise<Product[]> {
  return getAllProducts();
}

export async function getProduct(productId: number | string): Promise<Product> {
  const db = await getDb('dev');
  return await db.get(sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product
WHERE Id=${productId}
`);
}
