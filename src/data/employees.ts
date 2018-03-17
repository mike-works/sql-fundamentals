import { getDb } from '../db/utils';
import { sql } from '../sql-string';

/**
 * Columns to select for the `getAllEmployees` query
 */
const ALL_EMPLOYEES_COLUMNS = ['*'];

/**
 * Retrieve a collection of all Employee records in the database
 */
export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_EMPLOYEES_COLUMNS.join(',')}
FROM Employee`);
}

/**
 * Retrieve an Employee by id from the database
 * @param id Employee ID
 */
export async function getEmployee(id: string | number): Promise<Employee> {
  const db = await getDb();
  return await db.get(
    sql`
SELECT *
FROM Employee
WHERE id = $1`,
    id
  );
}
