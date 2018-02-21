import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import ws from '../src/ws';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX17: "PubSub" - Migration test')
class MigrationTest {
  @test('New .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(10);
  }

  @test('Function table_update_notify is found')
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getAllFunctions();
    assert.includeMembers(indexInfo.map(s => s.toLowerCase()), [
      'table_update_notify'
    ]);
  }
}

after(async () => {
  ws.close();
  (await getDb()).shutdown();
});
