import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import { assertMigrationCount } from './helpers/migrations';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';

@suite('EX009: "Create indices to boost query performance" - Migration test')
class MigrationIndicesTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(4);
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
