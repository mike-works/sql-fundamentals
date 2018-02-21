import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import './helpers/global-hooks';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';

@suite('EX17: "PubSub" - Edit order test')
class PubSubTest {
  @test('Creating an order results in a refreshAll')
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getAllFunctions();
    assert.includeMembers(indexInfo.map(s => s.toLowerCase()), [
      'table_update_notify'
    ]);
  }
}
