import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex06.create-order.test';
import { createOrder, getOrder } from '../src/data/orders';

@suite('EX12: "Supplier List View" - View Test')
class SupplierListViewTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    let migrationsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations')
    );
    assert.isAtLeast(
      migrationsFiles.length,
      7,
      'There are at least seven things in the ./migrations folder'
    );
    let migrationsSqlsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations', 'sqls')
    );
    assert.isAtLeast(
      migrationsSqlsFiles.length,
      12,
      'There are at least twelve things in the ./migrations/sqls folder'
    );
    let downMigrationCount = 0;
    let upMigrationCount = 0;
    migrationsSqlsFiles.forEach(fileName => {
      if (fileName.includes('-down')) {
        downMigrationCount++;
      }
      if (fileName.includes('-up')) {
        upMigrationCount++;
      }
    });
    assert.isAtLeast(
      downMigrationCount,
      5,
      'There are at least three down migrations'
    );
    assert.isAtLeast(
      upMigrationCount,
      5,
      'There are at least three up migrations'
    );
  }

  @test('SupplierList_V view exists')
  public async viewExists() {
    let db = await getDb('dev');
    let allViews = (await db.all(
      sql`select * from sqlite_master where type = 'view';`
    )).map(i => i.name);
    assert.includeMembers(
      allViews,
      ['SupplierList_V'],
      'SupplierList_V view is found'
    );
  }

  @test('Querying the view yields expected results')
  public async viewResults() {
    let db = await getDb('dev');
    let result = await db.get(sql`SELECT * from SupplierList_V`);
    assert.ok(result, 'Results of query are truthy');
    assert.includeMembers(
      Object.keys(result),
      ['id', 'companyname', 'contactname', 'productlist'],
      "Columns: 'id', 'companyname', 'contactname', 'productlist'"
    );
  }
}
