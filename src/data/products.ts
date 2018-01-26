import { getDb } from '../db/utils';
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
  'unitsonorder'
];

function whereClauseForFilter(filter: ProductCollectionFilter) {
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
  if (expressions.length === 0) {
    return '';
  }
  return sql`WHERE ${expressions.join(' AND ')}`;
}

function allProductsBaseQuery(opts: ProductCollectionOptions = {}) {
  const wh = opts.filter ? whereClauseForFilter(opts.filter) : '';
  return sql`SELECT ${ALL_PRODUCT_COLUMNS.map(c => `p.${c}`).join(',')},
  c.categoryname, s.companyname as suppliername
FROM Product as p
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
  throw new Error('Not yet implemented');
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
