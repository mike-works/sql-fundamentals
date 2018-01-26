import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test, slow, timeout } from 'mocha-typescript';
import { logger } from '../src/log';
import { updateOrder, createOrder, getOrder, deleteOrder, getOrderDetails } from '../src/data/orders';
import { VALID_ORDER_DATA } from '../tests/ex06.create-order.test';
import { merge } from 'lodash';

@suite('EX8: "Update an Order with OrderDetail items" - Update / Transaction test')
class UpdateOrderWithDetailsTest {
  @test('updateOrder() successfully updates the Freight, ShipName, RequiredDate, ShipAddress properties')
  public async updateOrderForValidData() {
    let { Id } = await createOrder(VALID_ORDER_DATA, [{ ProductId: 1, Quantity: 3, Discount: 0, UnitPrice: 3.00 }]);
    if (typeof Id === 'undefined') { assert.ok(false, 'newly created order Id is not truthy'); return; }

    await updateOrder(Id, Object.assign(Object.assign({}, VALID_ORDER_DATA), { Freight: 99, ShipAddress: '123 Fake Street', ShipName: 'Anyone', RequiredDate: '2022-01-01' }));
    let order = await getOrder(Id);
    assert.equal(order.Freight, 99, 'new value for Freight is correct');
    assert.equal(order.ShipName, 'Anyone', 'new value for ShipName is correct');
    assert.equal(order.RequiredDate, '2022-01-01', 'new value for RequiredDate is correct');
    assert.equal(order.ShipAddress, '123 Fake Street', 'new value for ShipAddress is correct');
  }

  @test('updateOrder() results in the order details being updated')
  public async updateOrderUpdatesDetails() {
    let { Id } = await createOrder(VALID_ORDER_DATA, [{ ProductId: 9, Quantity: 3, Discount: 0, UnitPrice: 3.00 }]);
    if (typeof Id === 'undefined') { assert.ok(false, 'newly created order Id is not truthy'); return; }
    let details = await getOrderDetails(Id);
    details[0].Discount = 0.5;
    await updateOrder(Id, Object.assign(Object.assign({}, VALID_ORDER_DATA), { Freight: 99, ShipAddress: '123 Fake Street', ShipName: 'Anyone', RequiredDate: '2022-01-01' }), details);
    details = await getOrderDetails(Id);
    assert.equal(details[0].Discount, 0.5, 'new value for details[0].Discount is correct');
  }
}
