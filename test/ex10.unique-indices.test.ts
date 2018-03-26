import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { createOrder } from '../src/data/orders';
import { getDb } from '../src/db/utils';

import { VALID_ORDER_DATA } from './ex06.create-order.test';
import './helpers/global-hooks';
import { assertMigrationCount } from './helpers/migrations';
import { assertIndicesExist } from './helpers/table';

@suite('EX10: "Unique Index" - Column constraints test')
class OrderDetailUniqueIndexTest {
  @test('migrationExists() new .sql file based migration exists in the ./migrations folder')
  public async migrationExists() {
    assertMigrationCount(4, 3);
  }

  @test('orderdetailuniqueproduct index exists')
  public async indexExists() {
    await assertIndicesExist(await getDb(), 'OrderDetail', ['orderdetailuniqueproduct']);
  }

  @test('Attempting to add two OrderDetail items to the same order with the same product fails')
  public async duplicateCheck() {
    let errors: string[] = [];
    try {
      await createOrder(VALID_ORDER_DATA, [
        { productid: 11, quantity: 3, discount: 0, unitprice: 3.0 },
        { productid: 11, quantity: 8, discount: 0, unitprice: 3.0 }
      ]);
      assert.ok(false, 'Error should have been thrown');
    } catch (e) {
      errors.push(e.toString());
    }
    assert.isAtLeast(errors.length, 1, 'At least one error was thrown');
    assert.include(
      errors[0].toLowerCase(),
      'unique',
      'Error message mentions something about a "unique" constraint'
    );
  }
}
