import * as sqlite from 'sqlite';
import { dbPath, getDb } from '../db/utils';

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb('dev');
  return await db.all('SELECT * FROM Employee');
}

export async function getEmployee(id: string|number): Promise<Employee[]> {
  const db = await getDb('dev');
  return await db.get('SELECT * FROM Employee WHERE id = $1', id);
}
