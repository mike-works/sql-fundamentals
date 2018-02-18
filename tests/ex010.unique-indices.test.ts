import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../src/db/utils';
import { sql } from '../src/sql-string';
import { VALID_ORDER_DATA } from './ex006.create-order.test';
import { createOrder } from '../src/data/orders';
import { assertMigrationCount } from './helpers/migrations';
import { assertIndicesExist } from './helpers/table';

@suite('EX0010: "Unique Index" - Column constraints test')
class OrderDetailUniqueIndexTest {
  @test(
    'migrationExists() new .sql file based migration exists in the ./migrations folder'
  )
  public async migrationExists() {
    assertMigrationCount(5);
  }

  @test('orderdetailuniqueproduct index exists')
  public async indexExists() {
    assertIndicesExist(await getDb(), 'orderdetail', [
      'orderdetailuniqueproduct'
    ]);
  }

  @test(
    'Attempting to add two OrderDetail items to the same order with the same product fails'
  )
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
