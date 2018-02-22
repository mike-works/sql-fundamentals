import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllCustomers } from '../src/data/customers';
import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX05: "Customer Order Count" - Aggregate Function Tests')
class CustomerOrderCountTest {
  @test('getAllCustomers() results must now include ordercount')
  public async orderCountIsPresent() {
    let [result] = await getAllCustomers();
    assert.containsAllKeys(result, ['ordercount']);
  }

  @test('getAllCustomers() ordercount must be the correct value')
  public async orderCountIsCorrect() {
    let [customer] = await getAllCustomers();
    let allOrders = await getAllOrders({ page: 1, perPage: 999999 });
    let orderCt = allOrders.filter(o => o.customerid === customer.id).length;
    assert.ok(customer.ordercount);
    assert.equal(customer.ordercount, orderCt);
  }
}
