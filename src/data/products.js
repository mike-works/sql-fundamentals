import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * @typedef {'sweet' | 'spicy' | 'sour' | 'salty' | 'bitter'} ProductFlavorName
 */

/**
 * @typedef ProductFlavorFilter
 * @property {ProductFlavorName} flavorName the name of the flavor
 * @property {1|2|3|4|5} level the flavor level (1-5)
 * @property {'less-than'|'greater-than'} type the "direction" of the filter
 * @export
 */

/**
 * @typedef ProductCollectionFilter
 * @property {'needs-reorder'|'discontinued'} inventory
 * @property {string[]} requiredTags
 * @property {ProductFlavorFilter[]} flavor
 * @description Filtering options that may be used to customize
 * the query for selecting a collection of Products
 */

/**
 * @typedef ProductCollectionOptions
 * @property {Partial<ProductCollectionFilter>} filter filtering options, which can be used to select a subset of Products
 * @description Options that may be used to customize queries for collections of Products
 */

/**
 * Columns to select for the `getAllProducts` query
 */
const ALL_PRODUCT_COLUMNS = ['*'];

/**
 * Retrieve a collection of all Product records from the database
 * @param {Partial<ProductCollectionOptions>} opts options that may be used to customize the query
 * @returns {Promise<Product[]>} the products
 */
export async function getAllProducts(opts = {}) {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_PRODUCT_COLUMNS.join(',')}
FROM Product`);
}

/**
 * Retrieve a single product record from the database by id
 * @param {number | string} id Product id
 * @returns {Promise<Product>} the product
 */
export async function getProduct(id) {
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
 * @param {number | string} id Product id
 * @param {Partial<Product>} data Product data
 * @returns {Promise<Product>} the product
 */
export async function updateProduct(id, data) {
  throw new Error('Not yet implemented');
}

/**
 * Create a new Product
 * @param {Pick<Product,| 'productname'| 'supplierid'| 'categoryid' | 'quantityperunit'| 'unitprice'| 'unitsinstock'| 'unitsonorder'| 'reorderlevel'| 'discontinued'>} p Product data
 * @returns {Promise<{ id: number | string }>} newly created product id
 */
export async function createProduct(p) {
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
 * @param {string | number} id Product id
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
  const db = await getDb();
  await db.run(sql`DELETE FROM Product WHERE id=$1;`, id);
}

/**
 * Get a Product's history of pricing changes
 * @param {string} id Product id
 * @returns {Promise<ProductPriceInfo[]>} Pricing history info
 */
export async function getProductPricingHistory(id) {
  return [];
}
