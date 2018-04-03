import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb, DbType } from '../src/db/utils';

import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX15: "Materialized Views" - Migration test')
class MaterializeViewsTest {
  @test('migrationExists() new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(7);
  }

  @test(
    '[POSTGRES ONLY] Materialized views [MV_CustomerLeaderboard, MV_EmployeeLeaderboard, MV_ProductLeaderboard, MV_RecentOrders] are found'
  )
  @onlyForDatabaseTypes(DbType.PostgreSQL)
  public async materializedViewsPresent() {
    let db = await getDb();
    let mvNames = await db.getAllMaterializedViews();
    assert.includeMembers(mvNames.map(s => s.toLowerCase()), [
      'mv_customerleaderboard',
      'mv_employeeleaderboard',
      'mv_productleaderboard',
      'mv_recentorders'
    ]);
  }

  @test(
    '[MYSQL and SQLITE ONLY] Views [V_CustomerLeaderboard, V_EmployeeLeaderboard, V_ProductLeaderboard, V_RecentOrders] are found'
  )
  @onlyForDatabaseTypes(DbType.MySQL, DbType.SQLite)
  public async viewsPresent() {
    let db = await getDb();
    let mvNames = await db.getAllViews();
    assert.includeMembers(mvNames.map(s => s.toLowerCase()), [
      'v_customerleaderboard',
      'v_employeeleaderboard',
      'v_productleaderboard',
      'v_recentorders'
    ]);
  }
}
