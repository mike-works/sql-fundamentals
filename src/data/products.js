import { SQLDatabase, SQLPreparedStatement } from '../db/db';
import { getDb, DbType, DB_TYPE } from '../db/utils';
import { logger } from '../log';
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
  'unitsonorder',
  'metadata',
  'tags'
];

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @returns {string[]}
 */
function selectPgClauseForCollectionFilter(filter) {
  if (!filter.flavor || filter.flavor.length === 0) {
    return [];
  }
  return filter.flavor.map(f => {
    return `cast(((metadata #> '{flavor}') ->> '${f.flavorName}') as int) as ${f.flavorName}`;
  });
}

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @returns {string[]}
 */
function selectMySQLClauseForCollectionFilter(filter) {
  if (!filter.flavor || filter.flavor.length === 0) {
    return [];
  }
  return filter.flavor.map(f => {
    return sql`${f.flavorName}`;
  });
}

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @returns {string[]}
 */
function selectSQLiteClauseForCollectionFilter(filter) {
  if (!filter.flavor || filter.flavor.length === 0) {
    return [];
  }
  return filter.flavor.map(f => {
    return sql`${f.flavorName}`;
  });
}

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @param {string} dbType
 * @returns {string}
 */
function selectClauseForCollectionFilter(filter, dbType = process.env.DB_TYPE || 'sqlite') {
  /** @type {string[]} */
  let toSelect = [];
  switch (dbType) {
    case 'mysql':
      toSelect = selectMySQLClauseForCollectionFilter(filter);
      break;
    case 'pg':
      toSelect = selectPgClauseForCollectionFilter(filter);
      break;
    case 'sqlite':
      toSelect = selectSQLiteClauseForCollectionFilter(filter);
      break;
    default:
      throw new Error(`Unknown db type: ${dbType}`);
  }
  return toSelect.join(', ');
}

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @returns {string[]}
 */
function whereSQLiteClauseForCollectionFilter(filter) {
  /** @type {string[]} */
  const expressions = [];
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp = tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(tagsExp);
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${f.level}`;
      })
    );
  }
  return expressions;
}

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @returns {string[]}
 */
function wherePgClauseForCollectionFilter(filter) {
  /** @type {string[]} */
  const expressions = [];
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp = tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(tagsExp);
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${f.level}`;
      })
    );
  }
  return expressions;
}

/**
 *
 *
 * @param {Partial<ProductCollectionFilter>} filter
 * @returns {string[]}
 */
function whereMySQLClauseForCollectionFilter(filter) {
  /** @type {string[]} */
  const expressions = [];
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp = tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(
      sql`JSON_CONTAINS(tags->'$[*]', cast('[${tags.map(t => `"${t}"`).join(', ')}]' as json))`
    );
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${f.level}`;
      })
    );
  }
  return expressions;
}

/**
 * Build the appropriate WHERE clause for a given ProductCollectionFilter
 * @param {Partial<ProductCollectionFilter>} filter filter for Product collection query
 * @param {string} dbType
 * @returns {string}
 */
function whereClauseForCollectionFilter(filter, dbType = process.env.DB_TYPE || 'sqlite') {
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

  switch (dbType) {
    case 'mysql':
      expressions.push(...whereMySQLClauseForCollectionFilter(filter));
      break;
    case 'pg':
      expressions.push(...wherePgClauseForCollectionFilter(filter));
      break;
    case 'sqlite':
      expressions.push(...whereSQLiteClauseForCollectionFilter(filter));
      break;
    default:
      throw new Error(`Unknown DB type: ${dbType}`);
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
  const wh = opts.filter ? whereClauseForCollectionFilter(opts.filter) : '';
  const s = opts.filter ? selectClauseForCollectionFilter(opts.filter) : '';
  return sql`SELECT p.*, c.categoryname, s.companyname as suppliername from (SELECT ${ALL_PRODUCT_COLUMNS.join(
    ','
  )}
  ${s ? `, ${s}` : ''}
FROM Product as pt) as p
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
 * @param {string} dbType database type string
 * @returns {Promise<Product>} the product
 */
export async function updateProduct(id, data, dbType = process.env.DB_TYPE || 'sqlite') {
  const db = await getDb();
  switch (dbType) {
    case 'mysql':
      return await updateProductMySQL(db, id, data);
    case 'pg':
      return await updateProductPg(db, id, data);
    default:
      throw new Error(`Products#updateProduct not supported for database type ${DB_TYPE}`);
  }
}

/**
 *
 * @param {SQLDatabase} db
 * @param {number | string} id Product id
 * @param {Partial<Product>} data Product data
 * @returns {Promise<Product>} the product
 */
async function updateProductPg(db, id, data) {
  return await db.get(
    sql`UPDATE Product
    SET metadata=$1, tags=($2)
  WHERE id = $3
  `,
    JSON.stringify(data.metadata),
    data.tags,
    id
  );
}

/**
 *
 * @param {SQLDatabase} db
 * @param {number | string} id Product id
 * @param {Partial<Product>} data Product data
 * @returns {Promise<Product>} the product
 */
async function updateProductMySQL(db, id, data) {
  return await db.get(
    sql`UPDATE Product
    SET metadata=$1, tags=$2
  WHERE id = $3
  `,
    JSON.stringify(data.metadata),
    JSON.stringify(data.tags),
    id
  );
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
INSERT INTO Product (productname, supplierid, categoryid, quantityperunit, unitprice, unitsinstock, unitsonorder, reorderlevel, discontinued, metadata, tags)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    p.productname,
    p.supplierid,
    p.categoryid,
    p.quantityperunit,
    p.unitprice,
    p.unitsinstock,
    p.unitsonorder,
    p.reorderlevel,
    p.discontinued,
    JSON.stringify({
      flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1 }
    }),
    DB_TYPE === DbType.PostgreSQL ? [] : JSON.stringify([])
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
  const db = await getDb();

  return await db.all(
    sql`SELECT fromprice,toprice,changedate FROM ProductPricingInfo WHERE productid=$1`,
    parseInt(id, 10)
  );
}
