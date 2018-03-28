import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';

import './helpers/global-hooks';

@suite('EX18: "PubSub" - Edit order test')
class PubSubTest {
  @test('Creating an order results in a refreshAll')
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getAllFunctions();
    assert.includeMembers(indexInfo.map(s => s.toLowerCase()), ['table_update_notify']);
  }
}
