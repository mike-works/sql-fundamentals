import { suite, test } from 'mocha-typescript';

import { getDb } from '../src/db/utils';

import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';
import { assertIndicesExist } from './helpers/table';

@suite('EX09: "Create indices to boost query performance" - Migration test')
class MigrationIndicesTest {
  @test('new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(3, 2);
  }

  @test('OrderDetail table now has indices orderdetailproductid and orderdetailorderid')
  public async orderDetailIndicesPresent() {
    await assertIndicesExist(await getDb(), 'OrderDetail', [
      'orderdetailproductid',
      'orderdetailorderid'
    ]);
  }

  @test('Order table now has indices ordercustomerid and OrderEmployeeId')
  public async orderIndicesPresent() {
    await assertIndicesExist(await getDb(), 'CustomerOrder', [
      'orderemployeeid',
      'ordercustomerid'
    ]);
  }

  @test('Product table now has index productsupplierid')
  public async productIndicesPresent() {
    await assertIndicesExist(await getDb(), 'Product', ['productsupplierid']);
  }

  @test('Employee table now has index employeereportsto')
  public async employeeIndicesPresent() {
    await assertIndicesExist(await getDb(), 'Employee', ['employeereportsto']);
  }
}
