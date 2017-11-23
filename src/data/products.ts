import * as sqlite from 'sqlite';
import { getDb } from '../db/utils';

const ALL_COLUMNS = [
  'Id',
  'QuantityPerUnit',
  'Discontinued',
  'SupplierId',
  'CategoryId',
  'UnitPrice',
  'UnitsOnOrder',
  'UnitsInStock',
  'ReorderLevel',
  'ProductName'
];
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(`
SELECT ${ALL_COLUMNS.join(',')}
FROM Product
`);
}

export async function getDiscontinuedProducts(): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(`
SELECT ${ALL_COLUMNS.join(',')}
FROM Product
WHERE Discontinued = 1
`);
}

export async function getProductsNeedingReorder(): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all(`
SELECT ${ALL_COLUMNS.join(',')}
FROM Product
WHERE Discontinued=0
  AND (UnitsOnOrder+UnitsInStock) <= ReorderLevel
`);
}
