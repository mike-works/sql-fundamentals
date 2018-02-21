import { assert } from 'chai';
import { sortBy } from 'lodash';
import { suite, test } from 'mocha-typescript';

import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX03: "All Orders List" Query - Sort tests')
class AllOrdersSortTest {
  @test('By default, order list is sorted ascending by id')
  public async orderListDefaults() {
    let firstPageResult = await getAllOrders({ perPage: 3 });
    let sortedById = sortBy(firstPageResult, 'id');
    assert.deepEqual(firstPageResult, sortedById);
  }

  @test(
    'using order="desc" (and specifying no column to sort on) sorts decending by id'
  )
  public async orderListDesc() {
    let firstPageResult = await getAllOrders({ perPage: 3, order: 'desc' });
    let sortedById = sortBy(firstPageResult, o => {
      let id: number = typeof o.id === 'string' ? parseInt(o.id, 10) : o.id;
      return -1 * id;
    });
    assert.deepEqual(firstPageResult, sortedById);
  }
}
