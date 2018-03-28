import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb, DbType } from '../src/db/utils';

import { getProduct } from '../src/data/products';
import { sql } from '../src/sql-string';
import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX16: "JSON & Array Columns" - Migration test')
class MigrationIndicesTest {
  @test('migrationExists() new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(7);
  }

  @test(
    '[POSTGRES ONLY] Product table now has indices product_tags, product_spicy, product_salty, product_sour, product_sweet, product_bitter'
  )
  @onlyForDatabaseTypes(DbType.PostgreSQL)
  public async postgresProductIndicesPresent() {
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

  @test('[MYSQL ONLY] Generated columns for flavors are found on product table')
  @onlyForDatabaseTypes(DbType.MySQL)
  public async mySQLGeneratedColumnsPresent() {
    let db = await getDb();
    let p = await db.get(sql`SELECT * from Product WHERE id=1`);
    assert.containsAllKeys(
      p,
      ['spicy', 'sweet', 'sour', 'salty', 'bitter'],
      'salty, sweet, sour, spicy and bitter columns are present on Product table'
    );
  }
}
