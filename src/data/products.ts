import { SQLDatabase, SQLStatement } from '../db/db';
import { getDb, DbType, DB_TYPE } from '../db/utils';
import { logger } from '../log';
import { sql } from '../sql-string';

export interface ProductFlavorFilter {
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

function selectPgClauseForCollectionFilter(
  filter: ProductCollectionFilter
): string[] {
  if (!filter.flavor || filter.flavor.length === 0) {
    return [];
  }
  return filter.flavor.map(f => {
    return sql`cast(((metadata #> '{flavor}') ->> '${
      f.flavorName
    }') as int) as ${f.flavorName}`;
  });
}
function selectMySQLClauseForCollectionFilter(
  filter: ProductCollectionFilter
): string[] {
  if (!filter.flavor || filter.flavor.length === 0) {
    return [];
  }
  return filter.flavor.map(f => {
    return sql`${f.flavorName}`;
  });
}

function selectSQLiteClauseForCollectionFilter(
  filter: ProductCollectionFilter
): string[] {
  if (!filter.flavor || filter.flavor.length === 0) {
    return [];
  }
  return filter.flavor.map(f => {
    return sql`${f.flavorName}`;
  });
}

function selectClauseForCollectionFilter(
  filter: ProductCollectionFilter,
  dbType: DbType
): string {
  let toSelect: string[] = [];
  switch (dbType) {
    case DbType.MySQL:
      toSelect = selectMySQLClauseForCollectionFilter(filter);
      break;
    case DbType.Postgres:
      toSelect = selectPgClauseForCollectionFilter(filter);
      break;
    case DbType.SQLite:
      toSelect = selectSQLiteClauseForCollectionFilter(filter);
      break;
  }
  return toSelect.join(', ');
}

function whereSQLiteClauseForCollectionFilter(
  filter: ProductCollectionFilter
): string[] {
  const expressions: string[] = [];
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp =
      tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(tagsExp);
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${
          f.level
        }`;
      })
    );
  }
  return expressions;
}

function wherePgClauseForCollectionFilter(
  filter: ProductCollectionFilter
): string[] {
  const expressions: string[] = [];
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp =
      tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(tagsExp);
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${
          f.level
        }`;
      })
    );
  }
  return expressions;
}

function whereMySQLClauseForCollectionFilter(
  filter: ProductCollectionFilter
): string[] {
  const expressions: string[] = [];
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp =
      tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(
      sql`JSON_CONTAINS(tags->'$[*]', cast('[${tags
        .map(t => `"${t}"`)
        .join(', ')}]' as json))`
    );
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${
          f.level
        }`;
      })
    );
  }
  return expressions;
}

function whereClauseForCollectionFilter(
  filter: ProductCollectionFilter,
  dbType: DbType
): string {
  const expressions: string[] = [];

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
    case DbType.MySQL:
      expressions.push(...whereMySQLClauseForCollectionFilter(filter));
      break;
    case DbType.Postgres:
      expressions.push(...wherePgClauseForCollectionFilter(filter));
      break;
    case DbType.SQLite:
      expressions.push(...whereSQLiteClauseForCollectionFilter(filter));
      break;
  }

  if (expressions.length === 0) {
    return '';
  }
  return sql`WHERE ${expressions.join(' AND ')}`;
}

function allProductsBaseQuery(opts: ProductCollectionOptions = {}) {
  const wh = opts.filter
    ? whereClauseForCollectionFilter(opts.filter, DB_TYPE)
    : '';
  const s = opts.filter
    ? selectClauseForCollectionFilter(opts.filter, DB_TYPE)
    : '';
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

export async function getAllProducts(
  opts: Partial<ProductCollectionOptions> = {}
): Promise<Product[]> {
  const db = await getDb();
  return await db.all(allProductsBaseQuery(opts));
}

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

export async function updateProduct(
  id: number | string,
  data: Partial<Product>
): Promise<Product> {
  const db = await getDb();
  switch (DB_TYPE) {
    case DbType.MySQL:
      return await updateProductMySQL(db, id, data);
    case DbType.Postgres:
      return await updateProductPg(db, id, data);
    default:
      throw new Error(
        `Products#updateProduct not supported for database type ${DB_TYPE}`
      );
  }
}

async function updateProductPg(
  db: SQLDatabase<SQLStatement>,
  id: number | string,
  data: Partial<Product>
): Promise<Product> {
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

async function updateProductMySQL(
  db: SQLDatabase<SQLStatement>,
  id: number | string,
  data: Partial<Product>
): Promise<Product> {
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
    DB_TYPE === DbType.Postgres ? [] : JSON.stringify([])
  );
  return { id: result.lastID };
}

export async function deleteProduct(id: string | number): Promise<void> {
  const db = await getDb();
  await db.run(sql`DELETE FROM Product WHERE id=$1;`, id);
}

export async function getProductPricingHistory(
  id: string | number
): Promise<ProductPriceInfo[]> {
  const db = await getDb();

  return await db.all(
    sql`SELECT fromprice,toprice,changedate FROM ProductPricingInfo WHERE productid=$1`,
    parseInt(id as string, 10)
  );
}
