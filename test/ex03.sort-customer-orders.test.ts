import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';

import { getCustomerOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX03: "Customer Orders List" Query - Sort tests')
class CustomerOrdersSortTest {
  @test('By default, order list is sorted ascending by ShippedDate')
  public async orderListDefaults() {
    let firstPageResult = await getCustomerOrders('ANTON', { perPage: 3 });

    let sortedById = orderBy(firstPageResult, 'shippeddate', 'asc');
    assert.deepEqual(firstPageResult, sortedById);
  }

  @test('using order="desc" (and specifying no column to sort on) sorts decending by shippeddate')
  public async orderListDesc() {
    let firstPageResult = await getCustomerOrders('ANTON', {
      perPage: 3,
      order: 'desc'
    });
    assert.containsAllKeys(firstPageResult[0], ['shippeddate']);

    let sortedById = orderBy(firstPageResult, 'shippeddate', 'desc');
    assert.deepEqual(firstPageResult, sortedById);
  }
}
