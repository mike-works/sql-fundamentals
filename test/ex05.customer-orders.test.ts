import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllCustomers } from '../src/data/customers';
import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX05: "Customer Num Orders" - Aggregate Function Tests')
class CustomerNumOrdersTest {
  @test('getAllCustomers() results must now include numorders')
  public async orderCountIsPresent() {
    let [result] = await getAllCustomers();
    assert.containsAllKeys(result, ['numorders']);
  }

  @test('getAllCustomers() numorders must be the correct value')
  public async orderCountIsCorrect() {
    let [customer] = await getAllCustomers();
    let allOrders = await getAllOrders({ page: 1, perPage: 999999 });
    let orderCt = allOrders.filter(o => o.customerid === customer.id).length;
    assert.ok(customer.numorders);
    assert.equal(customer.numorders, orderCt);
  }
}
