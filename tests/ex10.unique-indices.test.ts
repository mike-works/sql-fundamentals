import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex6.create-order.test';
import { createOrder } from '../src/data/orders';

@suite('EX10: "Unique Index" - Column constraints test')
class OrderDetailUniqueIndexTest {
  @test('migrationExists() new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    let migrationsFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations'));
    assert.isAtLeast(migrationsFiles.length, 5, 'There are at least five things in the ./migrations folder');
    let migrationsSqlsFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations', 'sqls'));
    assert.isAtLeast(migrationsSqlsFiles.length, 8, 'There are at least eight things in the ./migrations/sqls folder');
    let downMigrationCount = 0;
    let upMigrationCount = 0;
    migrationsSqlsFiles.forEach(fileName => {
      if (fileName.includes('down')) { downMigrationCount++; }
      if (fileName.includes('up')) { upMigrationCount++; }
    });
    assert.isAtLeast(downMigrationCount, 4, 'There are at least three down migrations');
    assert.isAtLeast(upMigrationCount, 4, 'There are at least three up migrations');
  }

  @test('OrderDetailUniqueProduct index exists')
  public async indexExists() {
    let db = await getDb('dev');
    let indexInfo = (await db.all(sql`PRAGMA index_list("OrderDetail")`)).map(i => i.name);
    assert.includeMembers(indexInfo, ['OrderDetailUniqueProduct'], 'OrderDetailUniqueProduct index was found');
  }

  @test('Attempting to add two OrderDetail items to the same order with the same product fails')
  public async duplicateCheck() {
    let errors: string[] = [];
    try {
      await createOrder(VALID_ORDER_DATA, [
        { ProductId: 11, Quantity: 3, Discount: 0, UnitPrice: 3.00 },
        { ProductId: 11, Quantity: 8, Discount: 0, UnitPrice: 3.00 }
      ]);
      assert.ok(false, 'Error should have been thrown');
    } catch (e) {
      errors.push(e.toString());
    }
    assert.isAtLeast(errors.length, 1, 'At least one error was thrown');
    assert.include(errors[0], 'UNIQUE', 'Error message mentions something about a "UNIQUE" constraint');
  }
}
