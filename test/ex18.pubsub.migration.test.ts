import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';

import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX18: "PubSub" - Migration test')
class MigrationTest {
  @test('New .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(9);
  }

  @test('Function table_update_notify is found')
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getAllFunctions();
    assert.includeMembers(indexInfo.map(s => s.toLowerCase()), ['table_update_notify']);
  }
}
