import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getOrder, getOrderWithDetails } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX05: "Order Subtotal" - Aggregate Function Tests')
class OrderSubtotalTest {
  @test('getOrder() results must now include subtotal')
  public async orderSubtotalPresent() {
    let orderResult = await getOrder(10248);
    assert.containsAllKeys(orderResult, ['subtotal']);
  }

  @test('getOrder() subtotalprice must be the correct amount')
  public async orderSubtotalCorrect() {
    let [orderResult, orderDetailResults] = await getOrderWithDetails(10248);
    let { subtotal } = orderResult;
    let calculatedPrice = orderDetailResults.reduce((acc, item) => {
      return acc + item.quantity * item.unitprice * (1 - item.discount);
    }, 0);
    assert.equal(
      subtotal,
      calculatedPrice,
      'Subtotal should equal sum(price * quantity * (1 - discount) ) over all items'
    );
  }
}
