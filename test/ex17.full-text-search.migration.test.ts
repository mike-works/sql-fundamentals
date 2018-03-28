import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';

import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX17: "Full Text Search" - Migration test')
class FullTextSearchMigrationTest {
  @test('New .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(9);
  }

  @test('product_fts, customer_fts, employee_fts and supplier_fts indices are found')
  public async productIndicesPresent() {
    let db = await getDb();
    assert.includeMembers((await db.getIndicesForTable('product')).map(s => s.toLowerCase()), [
      'product_fts'
    ]);
    assert.includeMembers((await db.getIndicesForTable('customer')).map(s => s.toLowerCase()), [
      'customer_fts'
    ]);
    assert.includeMembers((await db.getIndicesForTable('supplier')).map(s => s.toLowerCase()), [
      'supplier_fts'
    ]);
    assert.includeMembers((await db.getIndicesForTable('employee')).map(s => s.toLowerCase()), [
      'employee_fts'
    ]);
  }
}
