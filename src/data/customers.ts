import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';
import { dbPath, getDb } from '../db/utils';

sqlite3.verbose();

export async function getAllCustomers(): Promise<Customer[]> {
  const db = await getDb('dev');
  return await db.all('SELECT * FROM Customer');
}

export async function getCustomer(id: string | number): Promise<Customer[]> {
  const db = await getDb('dev');
  return await db.get('SELECT * FROM Customer WHERE id = $1', id);
}
