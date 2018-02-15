import { getDb } from '../db/utils';
import { sql } from '../sql-string';

interface ProductFlavorFilter {
  flavorName: string;
  level: number;
  type: 'less-than' | 'greater-than';
}

interface ProductCollectionFilter {
  inventory?: 'needs-reorder' | 'discontinued';
  requiredTags?: string[];
  flavor?: ProductFlavorFilter[];
}

interface ProductCollectionOptions {
  filter?: ProductCollectionFilter;
}

const ALL_PRODUCT_COLUMNS = ['*'];

export async function getAllProducts(
  opts: Partial<ProductCollectionOptions> = {}
): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product`);
}

export async function getProduct(id: number | string): Promise<Product> {
  const db = await getDb('dev');
  return await db.get(
    sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product
WHERE id = $1`,
    id
  );
}

export async function updateProduct(
  id: number | string,
  data: Partial<Product>
): Promise<Product> {
  throw new Error('Not yet implemented');
}
