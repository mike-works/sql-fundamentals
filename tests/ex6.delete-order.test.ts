import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { logger } from '../src/log';
import { createOrder, getAllOrders, deleteOrder } from '../src/data/orders';
import { VALID_ORDER_DATA } from '../tests/ex6.create-order.test';

@suite('EX6: "Delete an Order" - Record deletion test')
class DeleteOrderTest {
  @test('deleteOrder() for a newly-created order, completes without throwing an error')
  public async createOrderForValidData() {
    let { Id } = await createOrder(VALID_ORDER_DATA);
    await deleteOrder(Id);
    assert.ok(true, 'deleting an order that was just created doesn\'t throw errors');
  }
  @test('deleteOrder() results in the total number of orders decreasing')
  public async deleteOrderRemovesRecords() {
    let { Id } = await createOrder(VALID_ORDER_DATA);
    let originalNumOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    await deleteOrder(Id);
    let numOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    assert.equal(numOrders, originalNumOrders - 1, 'Total number of orders decreases as a result of deleting an order');
  }
  // @test('createOrder() rejects invalid data')
  // public async createOrderForInvalidData() {
  //   let errorMessages = [];
  //   try {
  //     let o = await createOrder(INVALID_ORDER_DATA);
  //   } catch (e) {
  //     errorMessages.push(e.toString());
  //   }
  //   assert.equal(errorMessages.length, 1, 'An error was thrown when trying to createOrder with invalid data');
  //   assert.include(errorMessages[0], 'NOT NULL constraint', 'Error message had to do with a NOT NULL constraint');
  //   // assert.ok(o, 'returns a promise that resolves to a non-empty vale');
  //   // assert.ok(o.Id, 'returns a promise that resolves to something with an Id property');
  //   // assert.isAtLeast(parseInt(o.Id as string, 10), 1, 'returns a promise that resolves to something with a numeric Id property, whose value is > 1');
  // }
}
