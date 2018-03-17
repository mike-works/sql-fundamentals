import { getDb } from '../db/utils';
import { sql } from '../sql-string';

type ProductFlavorName = 'sweet' | 'spicy' | 'sour' | 'salty' | 'bitter';

/**
 * A filtering constriant based around a flavor
 */
export interface ProductFlavorFilter {
  /** the name of the flavor */
  flavorName: ProductFlavorName;
  /** the flavor level (1-5) */
  level: 1 | 2 | 3 | 4 | 5;
  /** the "direction" of the filter */
  type: 'less-than' | 'greater-than';
}

/**
 * Filtering options that may be used to customize
 * the query for selecting a collection of Products
 */
interface ProductCollectionFilter {
  inventory?: 'needs-reorder' | 'discontinued';
  requiredTags?: string[];
  flavor?: ProductFlavorFilter[];
}

/**
 * Options that may be used to customize queries for collections of Products
 */
interface ProductCollectionOptions {
  /** filtering options, which can be used to select a subset of Products */
  filter: ProductCollectionFilter;
}

/**
 * Columns to select for the `getAllProducts` query
 */
const ALL_PRODUCT_COLUMNS = ['*'];

/**
 * Retrieve a collection of all Product records from the database
 * @param opts options that may be used to customize the query
 */
export async function getAllProducts(
  opts: Partial<ProductCollectionOptions> = {} // empty options by default
): Promise<Product[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product`);
}

/**
 * Retrieve a single product record from the database by id
 * @param id Product id
 */
export async function getProduct(id: number | string): Promise<Product> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product
WHERE id = $1`,
    id
  );
}
/**
 * Update the properties of a Product
 * @param id Product id
 * @param data Product data
 */
export async function updateProduct(id: number | string, data: Partial<Product>): Promise<Product> {
  throw new Error('Not yet implemented');
}

/**
 * Create a new Product
 * @param p Product data
 */
export async function createProduct(
  p: Pick<
    Product,
    | 'productname'
    | 'supplierid'
    | 'categoryid'
    | 'quantityperunit'
    | 'unitprice'
    | 'unitsinstock'
    | 'unitsonorder'
    | 'reorderlevel'
    | 'discontinued'
  >
): Promise<{ id: number | string }> {
  let db = await getDb();
  let result = await db.run(
    sql`
INSERT INTO Product (productname, supplierid, categoryid, quantityperunit, unitprice, unitsinstock, unitsonorder, reorderlevel, discontinued)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    p.productname,
    p.supplierid,
    p.categoryid,
    p.quantityperunit,
    p.unitprice,
    p.unitsinstock,
    p.unitsonorder,
    p.reorderlevel,
    p.discontinued
  );
  if (!result) {
    throw new Error('No "last inserted id" returned from SQL insertion!');
  }
  return { id: result.lastID };
}

/**
 * Delete a Product from the database
 * @param id Product id
 */
export async function deleteProduct(id: string | number): Promise<void> {
  const db = await getDb();
  await db.run(sql`DELETE FROM Product WHERE id=$1;`, id);
}

/**
 * Get a Product's history of pricing changes
 * @param id Product id
 */
export async function getProductPricingHistory(id: string | number): Promise<ProductPriceInfo[]> {
  return [];
}
