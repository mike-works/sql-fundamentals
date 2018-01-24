import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { logger } from '../src/log';
import { createOrder, getAllOrders } from '../src/data/orders';

export const VALID_ORDER_DATA: Partial<Order> = {
  EmployeeId: 4,
  CustomerId: 'BERGS',
  ShipCity: '',
  ShipAddress: '',
  ShipVia: 3,
  ShipRegion: '',
  ShipCountry: '',
  ShipPostalCode: '',
  RequiredDate: new Date(2030, 1, 1, 0, 0, 0, 0).toISOString(),
  Freight: 3.12
};

const INVALID_ORDER_DATA: Partial<Order> = {
  CustomerId: 'BERGS',
  ShipCity: '',
  ShipAddress: '',
  ShipVia: 3,
  ShipCountry: '',
  ShipPostalCode: '',
  RequiredDate: new Date(2010, 1, 1, 0, 0, 0, 0).toISOString(),
  Freight: 3.12
};

@suite('EX6: "Create an Order" - Record insertion test')
class CreateOrderTest {
  @test('createOrder() creates an order successfully for valid data')
  public async createOrderForValidData() {
    let o = await createOrder(VALID_ORDER_DATA);
    assert.ok(o, 'returns a promise that resolves to a non-empty vale');
    assert.ok(o.Id, 'returns a promise that resolves to something with an Id property');
    assert.isAtLeast(parseInt(o.Id as string, 10), 1, 'returns a promise that resolves to something with a numeric Id property, whose value is > 1');
  }
  @test('createOrder() results in the total number of orders increasing')
  public async createOrderAddsRecords() {
    let originalNumOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    await createOrder(VALID_ORDER_DATA);
    let numOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    assert.equal(numOrders, originalNumOrders + 1, 'Total number of orders increases as a result of creating an order');
  }
  @test('createOrder() rejects invalid data')
  public async createOrderForInvalidData() {
    let errorMessages = [];
    try {
      let o = await createOrder(INVALID_ORDER_DATA);
    } catch (e) {
      errorMessages.push(e.toString());
    }
    assert.equal(errorMessages.length, 1, 'An error was thrown when trying to createOrder with invalid data');
    assert.include(errorMessages[0], 'NOT NULL constraint', 'Error message had to do with a NOT NULL constraint');
    // assert.ok(o, 'returns a promise that resolves to a non-empty vale');
    // assert.ok(o.Id, 'returns a promise that resolves to something with an Id property');
    // assert.isAtLeast(parseInt(o.Id as string, 10), 1, 'returns a promise that resolves to something with a numeric Id property, whose value is > 1');
  }
}
