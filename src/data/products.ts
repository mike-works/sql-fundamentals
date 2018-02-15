import { getDb } from '../db/utils';
import { sql } from '../sql-string';

interface ProductFlavorFilter {
  flavorName: string;
  level: number;
  type: 'less-than' | 'greater-than';
}

interface ProductCollectionOptions {
  filter?: {
    inventory?: 'needs-reorder' | 'discontinued';
    requiredTags?: string[];
    flavor?: ProductFlavorFilter[];
  };
}

const ALL_PRODUCT_COLUMNS = ['*'];

export async function getAllProducts(
  opts: ProductCollectionOptions = {}
): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product`);
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
