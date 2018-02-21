import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb, DbType } from '../src/db/utils';

import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';

@suite('EX17: "PubSub" - Edit order test')
class PubSubTest {
  @test('[POSTGRES ONLY] Creating an order results in a refreshAll')
  @onlyForDatabaseTypes(DbType.Postgres)
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getAllFunctions();
    assert.includeMembers(indexInfo.map(s => s.toLowerCase()), [
      'table_update_notify'
    ]);
  }
}
