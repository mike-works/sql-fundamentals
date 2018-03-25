import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getOrder, getOrderDetails } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX04: "Order Page" Query - Join tests')
class OrderJoinTest {
  @test('getOrder() result must now include customername and employeename columns')
  public async getOrderColumnTest() {
    let firstPageResult = await getOrder(10300);
    assert.containsAllKeys(firstPageResult, ['customername', 'employeename']);
    assert.ok((firstPageResult as any).customername);
    assert.ok((firstPageResult as any).employeename);
  }
  @test('getOrderDetails() result must now include productname column')
  public async getOrderDetailsColumnTest() {
    let firstPageResult = await getOrderDetails(10300);
    assert.containsAllKeys(firstPageResult[0], ['productname']);
    assert.ok((firstPageResult[0] as any).productname);
  }
}
