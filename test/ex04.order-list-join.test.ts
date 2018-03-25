import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX04: "Orders List" Query - Join tests')
class OrdersListJoinTest {
  @test('getAllOrders() results must now include customername and employeename columns')
  public async allOrdersColumnTest() {
    let firstPageResult = await getAllOrders();
    assert.containsAllKeys(firstPageResult[0], ['customername', 'employeename']);
    assert.ok((firstPageResult[0] as any).customername);
    assert.ok((firstPageResult[0] as any).employeename);
  }
}
