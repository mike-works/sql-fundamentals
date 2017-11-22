import * as sqlite from 'sqlite';
import { dbPath, getDb } from '../db/utils';

export async function getAllSuppliers(): Promise<Supplier[]> {
  const db = await getDb('dev');
  return await db.all('SELECT * FROM Supplier');
}

export async function getSupplier(id: string | number): Promise<Supplier[]> {
  const db = await getDb('dev');
  return await db.get('SELECT * FROM Supplier WHERE id = $1', id);
}
