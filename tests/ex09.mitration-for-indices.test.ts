import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';

@suite('EX9: "Create indices to boost query performance" - Migration test')
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
    'OrderDetail table now has indices OrderDetailProductId and OrderDetailOrderId'
  )
  public async orderDetailIndicesPresent() {
    let db = await getDb('dev');
    let indexInfo = (await db.all(sql`PRAGMA index_list("OrderDetail")`)).map(
      i => i.name
    );
    assert.includeMembers(
      indexInfo,
      ['OrderDetailProductId', 'OrderDetailOrderId'],
      'OrderDetailProductId and OrderDetailOrderId are found'
    );
  }

  @test('Order table now has indices OrderCustomerId and OrderEmployeeId')
  public async orderIndicesPresent() {
    let db = await getDb('dev');
    let indexInfo = (await db.all(sql`PRAGMA index_list("Order")`)).map(
      i => i.name
    );
    assert.includeMembers(
      indexInfo,
      ['OrderEmployeeId', 'OrderCustomerId'],
      'OrderCustomerId and OrderEmployeeId are found'
    );
  }

  @test('Product table now has index ProductSupplierId')
  public async productIndicesPresent() {
    let db = await getDb('dev');
    let indexInfo = (await db.all(sql`PRAGMA index_list("Product")`)).map(
      i => i.name
    );
    assert.includeMembers(
      indexInfo,
      ['ProductSupplierId'],
      'ProductSupplierId is found'
    );
  }

  @test('Employee table now has index EmployeeReportsTo')
  public async employeeIndicesPresent() {
    let db = await getDb('dev');
    let indexInfo = (await db.all(sql`PRAGMA index_list("Employee")`)).map(
      i => i.name
    );
    assert.includeMembers(
      indexInfo,
      ['EmployeeReportsTo'],
      'EmployeeReportsTo is found'
    );
  }
}
