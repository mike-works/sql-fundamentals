import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { assertIndicesExist } from './helpers/table';

@suite('EX09: "Create indices to boost query performance" - Migration test')
class MigrationIndicesTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(4);
  }

  @test(
    'OrderDetail table now has indices orderdetailproductid and orderdetailorderid'
  )
  public async orderDetailIndicesPresent() {
    assertIndicesExist(await getDb(), 'orderdetail', [
      'orderdetailproductid',
      'orderdetailorderid'
    ]);
  }

  @test('Order table now has indices ordercustomerid and OrderEmployeeId')
  public async orderIndicesPresent() {
    assertIndicesExist(await getDb(), 'order', [
      'orderemployeeid',
      'ordercustomerid'
    ]);
  }

  @test('Product table now has index productsupplierid')
  public async productIndicesPresent() {
    assertIndicesExist(await getDb(), 'product', ['productsupplierid']);
  }

  @test('Employee table now has index employeereportsto')
  public async employeeIndicesPresent() {
    assertIndicesExist(await getDb(), 'employee', ['employeereportsto']);
  }
}
