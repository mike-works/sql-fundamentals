import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { getOrder, getOrderWithDetails } from '../src/data/orders';
import { logger } from '../src/log';

@suite('EX05: "Order Subtotal" - Aggregate Function Tests')
class OrderSubtotalTest {
  @test('getOrder() results must now include subtotalprice')
  public async orderSubtotalPresent() {
    let orderResult = await getOrder(10248);
    assert.containsAllKeys(orderResult, ['subtotalprice']);
  }

  @test('getOrder() subtotalprice must be the correct amount')
  public async orderSubtotalCorrect() {
    let [orderResult, orderDetailResults] = await getOrderWithDetails(10248);
    let { subtotalprice } = orderResult;
    let calculatedPrice = orderDetailResults.reduce((acc, item) => {
      return acc + item.quantity * item.unitprice;
    }, 0);
    assert.equal(
      subtotalprice,
      calculatedPrice,
      'Subtotal price should equal sum(price * quantity) over all items'
    );
  }
}
