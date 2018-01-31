import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_EMPLOYEES_COLUMNS = ['*'];

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb('dev');
  return await db.all(sql`
SELECT ${ALL_EMPLOYEES_COLUMNS.join(',')}
FROM Employee`);
}

export async function getEmployee(id: string | number): Promise<Employee> {
  const db = await getDb('dev');
  return await db.get(
    sql`
SELECT *
FROM Employee
WHERE id = $1`,
    id
  );
}
