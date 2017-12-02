import { assert } from 'chai';
import { sortBy } from 'lodash';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getCustomerOrders } from '../src/data/orders';

@suite('EX3: "Customer Orders List" Query - Sort tests')
class CustomerOrdersSortTest {
  @test('By default, order list is sorted ascending by ShippedDate')
  public async orderListDefaults() {
    let firstPageResult = await getCustomerOrders('ANTON', { perPage: 3 });
    let sortedById = sortBy(firstPageResult, 'ShippedDate');
    assert.deepEqual(firstPageResult, sortedById);
  }

  @test('using order="desc" (and specifying no column to sort on) sorts decending by ShippedDate')
  public async orderListDesc() {
    let firstPageResult = await getCustomerOrders('ANTON', { perPage: 3, order: 'desc' });
    let sortedById = sortBy(firstPageResult, o => {
      return -1 * new Date(o.ShippedDate).valueOf();
    });
    assert.deepEqual(firstPageResult, sortedById);
  }
}
