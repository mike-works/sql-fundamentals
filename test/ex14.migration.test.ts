import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';

import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX14: "JSON & Array Columns" - Migration test')
class MigrationIndicesTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    assertMigrationCount(7);
  }

  @test(
    'Product table now has indices product_tags, product_spicy, product_salty, product_sour, product_sweet, product_bitter'
  )
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getIndicesForTable('product');
    assert.includeMembers(indexInfo.map(s => s.toLowerCase()), [
      'product_tags',
      'product_spicy',
      'product_salty',
      'product_sour',
      'product_sweet',
      'product_bitter'
    ]);
  }
}
