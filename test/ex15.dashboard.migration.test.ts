import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import './helpers/global-hooks';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX15: "Materialized Views" - Migration test')
class MaterializeViewsTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    assertMigrationCount(9);
  }

  @test(
    'Materialized views [customer_leaderboard, employee_leaderboard, product_leaderboard, recent_orders] are found'
  )
  public async productIndicesPresent() {
    let db = await getDb();
    let mvNames = await db.getAllMaterializedViews();
    assert.includeMembers(mvNames.map(s => s.toLowerCase()), [
      'customer_leaderboard',
      'employee_leaderboard',
      'product_leaderboard',
      'recent_orders'
    ]);
  }
}
