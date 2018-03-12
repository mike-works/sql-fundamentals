import { assert } from 'chai';
import { SQLDatabase } from 'src/db/db';

export async function assertTableExists(db: SQLDatabase, tableName: string) {
  let allTables = await db.getAllTableNames();
  assert.includeMembers(
    allTables.map(t => t.toLowerCase()),
    [tableName],
    `${tableName} table is found`
  );
}

export async function assertIndicesExist(
  db: SQLDatabase,
  tableName: string,
  indexNames: string[]
) {
  let indexInfo = await db.getIndicesForTable(tableName);
  assert.includeMembers(
    indexInfo.map(s => s.toLowerCase()),
    indexNames,
    `${indexNames.join(', ')} indices were found`
  );
}

export async function assertTriggersExist(
  db: SQLDatabase,
  triggerNames: string[]
) {
  let allTriggers = await db.getAllTriggers();
  assert.includeMembers(
    allTriggers.map(s => s.toLowerCase()),
    triggerNames.map(s => s.toLowerCase()),
    `${triggerNames.join(', ')} trigger(s) found`
  );
}

export async function assertViewsExist(db: SQLDatabase, viewNames: string[]) {
  let allViews = await db.getAllViews();
  assert.includeMembers(
    allViews.map(s => s.toLowerCase()),
    viewNames.map(s => s.toLowerCase()),
    `${viewNames.join(', ')} view(s) found`
  );
}
