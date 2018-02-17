import { getDb } from '../db/utils';
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

function selectClauseForCollectionFilter(filter: ProductCollectionFilter) {
  if (!filter.flavor || filter.flavor.length === 0) {
    return '';
  }
  return filter.flavor.map(f => {
    return sql`cast(((metadata #> '{flavor}') ->> '${
      f.flavorName
    }') as int) as ${f.flavorName}`;
  });
}

function whereClauseForCollectionFilter(filter: ProductCollectionFilter) {
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
  let { requiredTags: tags } = filter;
  if (tags && tags.length > 0) {
    let tagsExp =
      tags.length > 0 ? sql`p.tags && '{${tags.join(', ')}}'::text[]` : '';
    expressions.push(tagsExp);
  }
  if (filter.flavor && filter.flavor.length >= 0) {
    logger.warn('flavor=', filter.flavor);
    expressions.push(
      ...filter.flavor.map(f => {
        return `${f.flavorName} ${f.type === 'greater-than' ? '>' : '<'} ${
          f.level
        }`;
      })
    );
  }
  if (expressions.length === 0) {
    return '';
  }
  return sql`WHERE ${expressions.join(' AND ')}`;
}

function allProductsBaseQuery(opts: ProductCollectionOptions = {}) {
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
  return await db.get(
    sql`UPDATE Product
    SET metadata=$2, tags=($3)
  WHERE id = $1
  `,
    id,
    JSON.stringify(data.metadata),
    data.tags
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
INSERT INTO Product (id,productname, supplierid, categoryid, quantityperunit, unitprice, unitsinstock, unitsonorder, reorderlevel, discontinued)
VALUES (nextval('product_id_seq'), $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
  return { id: result.lastID };
}

export async function deleteProduct(id: string | number): Promise<void> {
  const db = await getDb();
  await db.run(sql`DELETE FROM "product" WHERE id=$1;`, id);
}
