import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_PRODUCT_COLUMNS = ['*'];

export async function getAllProducts(
  { tags }: { tags: string[] } = { tags: [] }
): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product`);
}

export async function getDiscontinuedProducts(): Promise<Product[]> {
  return getAllProducts();
}

export async function getProductsNeedingReorder(): Promise<Product[]> {
  return getAllProducts();
}

export async function getProduct(productId: number | string): Promise<Product> {
  const db = await getDb('dev');
  return await db.get(
    sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product
WHERE Id = $1`,
    productId
  );
}

export async function updateProduct(
  productId: number | string,
  data: Partial<Product>
): Promise<Product> {
  console.log('data=', JSON.stringify(data.tags));
  const db = await getDb('dev');
  return await db.get(
    sql`UPDATE Product
    SET metadata=$2::json, tags=($3)
  WHERE id = $1
  `,
    productId,
    JSON.stringify(data.metadata),
    data.tags
  );
}
