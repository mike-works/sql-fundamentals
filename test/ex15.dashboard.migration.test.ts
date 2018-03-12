import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getDb, DbType } from '../src/db/utils';

import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';

@suite('EX15: "Materialized Views" - Migration test')
class MaterializeViewsTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    assertMigrationCount(8);
  }

  @test(
    '[MYSQL and POSTGRES ONLY] Materialized views [MV_CustomerLeaderboard, MV_EmployeeLeaderboard, MV_ProductLeaderboard, MV_RecentOrders] are found'
  )
  @onlyForDatabaseTypes(DbType.MySQL, DbType.Postgres)
  public async materializedViewsPresent() {
    let db = await getDb();
    let mvNames = await db.getAllMaterializedViews();
    assert.includeMembers(mvNames.map(s => s.toLowerCase()), [
      'MV_CustomerLeaderboard',
      'MV_EmployeeLeaderboard',
      'MV_ProductLeaderboard',
      'MV_RecentOrders'
    ]);
  }

  @test(
    '[SQLITE ONLY] Views [V_CustomerLeaderboard, V_EmployeeLeaderboard, V_ProductLeaderboard, V_RecentOrders] are found'
  )
  @onlyForDatabaseTypes(DbType.SQLite)
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
