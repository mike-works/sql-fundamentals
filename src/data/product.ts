import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';
import { getDb } from '../db/utils';

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.all('SELECT * FROM Product');
}

export async function getProduct(id: string | number): Promise<Product[]> {
  const db = await getDb('dev');
  return await db.get('SELECT * FROM Product WHERE id = $1', id);
}
