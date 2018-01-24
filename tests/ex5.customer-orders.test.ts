import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { getAllCustomers } from '../src/data/customers';
import { getAllOrders } from '../src/data/orders';
import { logger } from '../src/log';

@suite('EX5: "Customer Order Count" - Aggregate Function Tests')
class CustomerOrderCountTest {
  @test('getAllCustomers() results must now include OrderCount')
  public async orderCountIsPresent() {
    let [result] = await getAllCustomers();
    assert.containsAllKeys(result, ['OrderCount']);
  }

  @test('getAllCustomers() OrderCount must be the correct value')
  public async orderCountIsCorrect() {
    let [customer] = await getAllCustomers();
    let allOrders = await getAllOrders({ page: 1, perPage: 999999 });
    let orderCt = allOrders
      .filter(o => o.CustomerId === customer.Id)
      .length;
    console.log('orderCt= ', orderCt);
    assert.ok(customer.OrderCount);
    assert.equal(customer.OrderCount, orderCt);
  }
}
