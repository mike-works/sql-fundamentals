import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';

import { createOrder, getOrder, getOrderDetails, updateOrder } from '../src/data/orders';

import { VALID_ORDER_DATA } from './ex06.create-order.test';
import './helpers/global-hooks';

@suite('EX08: "Update an Order with OrderDetail items" - Update / Transaction test')
class UpdateOrderWithDetailsTest {
  @test(
    'updateOrder() successfully updates the freight, shipname, requireddate, shipaddress properties'
  )
  public async updateOrderForValidData() {
    let { id } = await createOrder(VALID_ORDER_DATA, [
      { productid: 1, quantity: 3, discount: 0, unitprice: 3.0 }
    ]);
    if (typeof id === 'undefined') {
      assert.ok(false, 'newly created order id is not truthy');
      return;
    }

    await updateOrder(
      id,
      Object.assign(Object.assign({}, VALID_ORDER_DATA), {
        freight: 99,
        shipaddress: '123 Fake Street',
        shipname: 'Anyone',
        requireddate: '2022-01-01'
      })
    );
    let order = await getOrder(id);
    assert.equal(order.freight, 99, 'new value for freight is correct');
    assert.equal(order.shipname, 'Anyone', 'new value for shipname is correct');
    assert.equal(order.requireddate, '2022-01-01', 'new value for requireddate is correct');
    assert.equal(order.shipaddress, '123 Fake Street', 'new value for ShipAddress is correct');
  }
  @test('updateOrder() results in the order details being updated')
  public async updateOrderUpdatesDetails() {
    let { id } = await createOrder(VALID_ORDER_DATA, [
      { productid: 9, quantity: 3, discount: 0, unitprice: 3.0 }
    ]);
    if (typeof id === 'undefined') {
      assert.ok(false, 'newly created order id is not truthy');
      return;
    }
    let details = await getOrderDetails(id);
    details[0].discount = 0.5;
    await updateOrder(
      id,
      Object.assign(Object.assign({}, VALID_ORDER_DATA), {
        freight: 99,
        shipaddress: '123 Fake Street',
        shipname: 'Anyone',
        requireddate: '2022-01-01'
      }),
      details
    );
    details = await getOrderDetails(id);
    assert.equal(details[0].discount, 0.5, 'new value for details[0].discount is correct');
  }
}
