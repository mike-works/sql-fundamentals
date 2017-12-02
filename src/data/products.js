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
const ALL_PRODUCT_COLUMNS = [
  'id',
  'categoryid',
  'discontinued',
  'productname',
  'quantityperunit',
  'reorderlevel',
  'supplierid',
  'unitprice',
  'unitsinstock',
  'unitsonorder'
];

/**
 * Build the appropriate WHERE clause for a given ProductCollectionFilter
 * @param {Partial<ProductCollectionFilter>} filter filter for Product collection query
 */
function whereClauseForFilter(filter) {
  /** @type {string[]} */
  const expressions = [];
  if (filter.inventory) {
    switch (filter.inventory) {
      case 'discontinued':
        expressions.push('discontinued = 1');
        break;
      case 'needs-reorder':
        expressions.push('discontinued = 0');
        expressions.push('(unitsonorder + unitsinstock) < reorderlevel');
        break;
    }
  }
  if (expressions.length === 0) {
    return '';
  }
  return sql`WHERE ${expressions.join(' AND ')}`;
}

/**
 * Build a query for a collection of Product records
 *
 * @param {Partial<ProductCollectionOptions>} opts options
 * @returns {string}
 */
function allProductsBaseQuery(opts) {
  const wh = opts.filter ? whereClauseForFilter(opts.filter) : '';
  return sql`
SELECT ${ALL_PRODUCT_COLUMNS.map(c => `p.${c}`).join(',')},
  c.categoryname, s.companyname as suppliername
FROM Product as p
INNER JOIN Supplier as s
  ON p.supplierid=s.id
INNER JOIN Category as c
  ON p.categoryid=c.id
${wh}`;
}

/**
 * Retrieve a collection of all Product records from the database
 * @param {Partial<ProductCollectionOptions>} opts options that may be used to customize the query
 * @returns {Promise<Product[]>} the products
 */
export async function getAllProducts(opts = {}) {
  const db = await getDb();
  return await db.all(allProductsBaseQuery(opts));
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
