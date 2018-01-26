import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { logger } from '../src/log';
import { createOrder, getAllOrders, deleteOrder } from '../src/data/orders';
import { VALID_ORDER_DATA } from '../tests/ex06.create-order.test';

@suite('EX6: "Delete an Order" - Record deletion test')
class DeleteOrderTest {
  @test('deleteOrder() for a newly-created order, completes without throwing an error')
  public async deleteOrderFinishes() {
    let { Id } = await createOrder(VALID_ORDER_DATA);
    if (typeof Id === 'undefined') { throw new Error('createOrder() should return an object with an Id'); }
    await deleteOrder(Id);
    assert.ok(true, 'deleting an order that was just created doesn\'t throw errors');
  }
  @test('deleteOrder() results in the total number of orders decreasing')
  public async deleteOrderRemovesRecords() {
    let { Id } = await createOrder(VALID_ORDER_DATA);
    let originalNumOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    if (typeof Id === 'undefined') { throw new Error('createOrder() should return an object with an Id'); }
    await deleteOrder(Id);
    let numOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    assert.equal(numOrders, originalNumOrders - 1, 'Total number of orders decreases as a result of deleting an order');
  }
}
