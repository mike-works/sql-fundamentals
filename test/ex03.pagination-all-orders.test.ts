import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX03: "All Orders List" Query - Pagination tests')
class AllOrdersPaginationTest {
  @test('First item is the same, regardless of page size')
  public async firstPage() {
    let first40Result = await getAllOrders({ perPage: 40, page: 1 });
    let first20Result = await getAllOrders({ perPage: 20, page: 1 });
    assert.isArray(first20Result, 'Expected result to be an array');
    assert.equal(
      first20Result.length,
      20,
      'Expected 20 orders in array when perPage = 20'
    );
    assert.equal(
      first40Result.length,
      40,
      'Expected 40 orders in array when perPage = 40'
    );
  }

  @test('When perPage = 20, page 2 starts at item 20')
  public async offset() {
    let first40Result = await getAllOrders({ perPage: 40, page: 1 });
    let first20Result = await getAllOrders({ perPage: 20, page: 1 });
    let second20Result = await getAllOrders({ perPage: 20, page: 2 });

    assert.isArray(second20Result, 'Expected result to be an array');
    assert.equal(second20Result.length, 20, 'Expected 20 orders in array');

    assert.deepEqual(
      second20Result[0],
      first40Result[20],
      'First item on the second page of 20 is the 20th item on the first page of 40'
    );
  }

  @test('If no perPage option is specified, page size is 25')
  public async pageOf25ByDefault() {
    let firstPg = await getAllOrders();
    assert.isArray(firstPg, 'Expected result to be an array');
    assert.equal(firstPg.length, 20, 'Expected 20 orders in array');
  }

  @test('If no page option is specified, first page is returned')
  public async firstPageByDefault() {
    let result = await getAllOrders();
    let firstPageResult = await getAllOrders({ page: 1 });
    assert.isArray(result, 'Expected result to be an array');
    assert.isArray(firstPageResult, 'Expected result to be an array');

    assert.deepEqual(
      result[0],
      firstPageResult[0],
      'First item is the same, regardless of whether page=1 or page option is not provided at all'
    );
  }
}
