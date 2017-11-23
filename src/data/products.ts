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
  return getAllProducts();
}

export async function getProductsNeedingReorder(): Promise<Product[]> {
  return getAllProducts();
}
