import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { createOrder, getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

export const VALID_ORDER_DATA: Partial<Order> = {
  employeeid: 4,
  customerid: 'BERGS',
  shipcity: '',
  shipaddress: '',
  shipvia: 3,
  shipregion: '',
  shipcountry: '',
  shippostalcode: '',
  requireddate: new Date(2030, 1, 1, 0, 0, 0, 0).toISOString(),
  freight: 3.12
};

const INVALID_ORDER_DATA: Partial<Order> = {
  customerid: 'BERGS',
  shipcity: '',
  shipaddress: '',
  shipvia: 3,
  shipcountry: '',
  shippostalcode: '',
  requireddate: new Date(2010, 1, 1, 0, 0, 0, 0).toISOString(),
  freight: 3.12
};

@suite('EX06: "Create an Order" - Record insertion test')
class CreateOrderTest {
  @test('createOrder() creates an order successfully for valid data')
  public async createOrderForValidData() {
    let o = await createOrder(VALID_ORDER_DATA);
    assert.ok(o, 'returns a promise that resolves to a non-empty vale');
    assert.ok(
      o.id,
      'returns a promise that resolves to something with an id property'
    );
    assert.isAtLeast(
      parseInt(o.id as string, 10),
      1,
      'returns a promise that resolves to something with a numeric id property, whose value is > 1'
    );
  }
  @test('createOrder() results in the total number of orders increasing')
  public async createOrderAddsRecords() {
    let originalNumOrders = (await getAllOrders({ page: 1, perPage: 9999999 }))
      .length;
    await createOrder(VALID_ORDER_DATA);
    let numOrders = (await getAllOrders({ page: 1, perPage: 9999999 })).length;
    assert.equal(
      numOrders,
      originalNumOrders + 1,
      'Total number of orders increases as a result of creating an order'
    );
  }
  @test('createOrder() rejects invalid data')
  public async createOrderForInvalidData() {
    let errorMessages = [];
    try {
      let o = await createOrder(INVALID_ORDER_DATA);
    } catch (e) {
      errorMessages.push(e.toString());
    }
    assert.equal(
      errorMessages.length,
      1,
      'An error was thrown when trying to createOrder with invalid data'
    );
    assert.match(
      errorMessages[0].toLowerCase(),
      /(null constraint)|(cannot be null)/,
      'Error message had to do with a NOT NULL constraint'
    );
    // assert.ok(o, 'returns a promise that resolves to a non-empty vale');
    // assert.ok(o.Id, 'returns a promise that resolves to something with an Id property');
    // assert.isAtLeast(parseInt(o.Id as string, 10), 1, 'returns a promise that resolves to something with a numeric Id property, whose value is > 1');
  }
}
