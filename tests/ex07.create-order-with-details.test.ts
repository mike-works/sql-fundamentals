import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test, slow, timeout } from 'mocha-typescript';
import { logger } from '../src/log';
import { createOrder, getAllOrders, deleteOrder, getOrderDetails } from '../src/data/orders';
import { VALID_ORDER_DATA } from '../tests/ex06.create-order.test';

@suite('EX7: "Create an Order with OrderDetail items" - Transaction test')
class CreateOrderWithDetailsTest {
  @test('createOrder() completes without throwing an error')
  public async createOrderForValidData() {
    let { Id } = await createOrder(VALID_ORDER_DATA, [{ ProductId: 1, Quantity: 3, Discount: 0, UnitPrice: 3.00 }]);
    if (typeof Id === 'undefined') { throw new Error('createOrder() should return an object with an Id'); }
    assert.ok(Id, 'createOrder() returns an object with an Id');
  }

  @test('createOrder() results in the order details being created')
  public async createOrderAddsRecords() {
    let { Id } = await createOrder(VALID_ORDER_DATA, [{ ProductId: 1, Quantity: 3, Discount: 0, UnitPrice: 3.00 }]);
    if (typeof Id === 'undefined') { assert.ok(false, 'newly created order Id is not truthy'); return; }
    let orderDetails = await getOrderDetails(Id);
    assert.equal(orderDetails.length, 1, 'Total number of Orders increases as a result of creating an order');
  }
}
