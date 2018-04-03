import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';

import { createOrder, deleteOrder, getAllOrders } from '../src/data/orders';

import { VALID_ORDER_DATA } from './ex06.create-order.test';
import './helpers/global-hooks';

@suite('EX06: "Delete an Order" - Record deletion test')
class DeleteOrderTest {
  @test('deleteOrder() for a newly-created order, completes without throwing an error')
  public async deleteOrderFinishes() {
    let { id } = await createOrder(VALID_ORDER_DATA);
    if (typeof id === 'undefined') {
      throw new Error('createOrder() should return an object with an id');
    }
    await deleteOrder(id);
    assert.ok(true, "deleting an order that was just created doesn't throw errors");
  }
  @test('deleteOrder() results in the total number of orders decreasing')
  public async deleteOrderRemovesRecords() {
    let { id } = await createOrder(VALID_ORDER_DATA);
    let originalNumOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    if (typeof id === 'undefined') {
      throw new Error('createOrder() should return an object with an id');
    }
    await deleteOrder(id);
    let numOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    assert.equal(
      numOrders,
      originalNumOrders - 1,
      'Total number of orders decreases as a result of deleting an order'
    );
  }
}
