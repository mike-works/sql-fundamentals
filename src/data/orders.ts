import * as sqlite from 'sqlite';
import { dbPath, getDb } from '../db/utils';

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb('dev');
  return await db.all('SELECT * FROM "Order"');
}

export async function getOrder(id: string | number): Promise<Order[]> {
  const db = await getDb('dev');
  return await db.get('SELECT * FROM "Order" WHERE Id = $1', id);
}
