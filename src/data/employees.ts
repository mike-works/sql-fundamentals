import { getDb } from '../db/utils';
import { sql } from '../sql-string';

const ALL_EMPLOYEES_COLUMNS = [
  'id',
  'firstname',
  'lastname',
  'region',
  'reportsto',
  'hiredate',
  'title'
];

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb();
  return await db.all(sql`
SELECT ${ALL_EMPLOYEES_COLUMNS.map(c => `e.${c}`).join(
      ','
    )}, count(o.id) as ordercount
FROM Employee as e
LEFT JOIN CustomerOrder as o
  ON o.employeeid=e.id
GROUP BY e.id`);
}

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
