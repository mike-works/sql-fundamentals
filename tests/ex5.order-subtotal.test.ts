import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { getOrder, getOrderWithDetails } from '../src/data/orders';
import { logger } from '../src/log';

@suite('EX5: "Order Subtotal" - Aggregate Function Tests')
class OrderSubtotalTest {
  @test('getOrder() results must now include SubtotalPrice')
  public async orderSubtotalPresent() {
    let orderResult = await getOrder(10248);
    assert.containsAllKeys(orderResult, ['SubtotalPrice']);
  }

  @test('getOrder() SubtotalPrice must be the correct amount')
  public async orderSubtotalCorrect() {
    let [orderResult, orderDetailResults] = await getOrderWithDetails(10248);
    let { SubtotalPrice } = orderResult;
    let calculatedPrice = orderDetailResults.reduce((acc, item) => {
      return acc + (item.Quantity * item.UnitPrice)
    }, 0);
    assert.equal(SubtotalPrice, calculatedPrice, 'Subtotal price should equal sum(price * quantity) over all items');
  }
}
