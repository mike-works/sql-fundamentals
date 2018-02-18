import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';

@suite('EX009: "Create indices to boost query performance" - Migration test')
class MigrationIndicesTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    assert.ok(
      fs.existsSync(path.join(__dirname, '..', 'migrations')),
      './migrations folder exists'
    );
    let migrationsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations')
    );
    assert.includeDeepMembers(
      migrationsFiles,
      ['sqls', '20171203034929-first.js'],
      './migrations folder contains sqls folder and first migration'
    );
    assert.isAtLeast(
      migrationsFiles.length,
      3,
      'There are at least three things in the ./migrations folder'
    );
    assert.ok(
      fs.existsSync(path.join(__dirname, '..', 'migrations', 'sqls')),
      './sqls folder exists'
    );
    let migrationsSqlsFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations', 'sqls')
    );
    assert.isAtLeast(
      migrationsSqlsFiles.length,
      4,
      'There are at least four things in the ./migrations/sqls folder'
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
    assert.equal(
      downMigrationCount,
      upMigrationCount,
      'There is a matching up migration for every down migration'
    );
    assert.isAtLeast(
      downMigrationCount,
      2,
      'There are at least two down migrations'
    );
    assert.isAtLeast(
      upMigrationCount,
      2,
      'There are at least two up migrations'
    );
  }

  @test(
    'OrderDetail table now has indices orderdetailproductid and orderdetailorderid'
  )
  public async orderDetailIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getIndicesForTable('orderdetail');
    assert.includeMembers(
      indexInfo.map(s => s.toLowerCase()),
      ['orderdetailproductid', 'orderdetailorderid'],
      'orderdetailproductid and orderdetailorderid are found'
    );
  }

  @test('Order table now has indices ordercustomerid and OrderEmployeeId')
  public async orderIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getIndicesForTable('order');

    assert.includeMembers(
      indexInfo.map(s => s.toLowerCase()),
      ['orderemployeeid', 'ordercustomerid'],
      'ordercustomerid and orderemployeeid are found'
    );
  }

  @test('Product table now has index productsupplierid')
  public async productIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getIndicesForTable('product');

    assert.includeMembers(
      indexInfo.map(s => s.toLowerCase()),
      ['productsupplierid'],
      'productsupplierid is found'
    );
  }

  @test('Employee table now has index employeereportsto')
  public async employeeIndicesPresent() {
    let db = await getDb();
    let indexInfo = await db.getIndicesForTable('employee');

    assert.includeMembers(
      indexInfo.map(s => s.toLowerCase()),
      ['employeereportsto'],
      'employeereportsto is found'
    );
  }
}
