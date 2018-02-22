import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';

import {
  getCustomerSalesLeaderboard,
  getEmployeeSalesLeaderboard,
  getProductSalesLeaderboard,
  getRecentOrders,
  getReorderList
} from '../src/data/dashboard';

import { validateRecordColumns } from './helpers/columns';
import './helpers/global-hooks';

@suite('EX00: Initial Dashboard Queries', slow(10000), timeout(20000))
class InitialDashboardQueriesTest {
  @test('Product leaderboard query')
  public async productLeaderboardTest() {
    let result = await getProductSalesLeaderboard();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 5, 'Expected exactly 5 products');
    validateRecordColumns(
      {
        recordType: 'product-leaderboard',
        functionName: 'getProductSalesLeaderboard'
      },
      result[3],
      ['name', 'amount']
    );
  }
  @test('Employee leaderboard query')
  public async employeeLeaderboardTest() {
    let result = await getEmployeeSalesLeaderboard();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 5, 'Expected exactly 5 employees');
    validateRecordColumns(
      {
        recordType: 'employee-leaderboard',
        functionName: 'getEmployeeSalesLeaderboard'
      },
      result[3],
      ['name', 'amount']
    );
  }
  @test('Customer leaderboard query')
  public async customerLeaderboardTest() {
    let result = await getCustomerSalesLeaderboard();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 5, 'Expected exactly 5 customers');
    validateRecordColumns(
      {
        recordType: 'customer-leaderboard',
        functionName: 'getCustomerSalesLeaderboard'
      },
      result[3],
      ['name', 'amount']
    );
  }
  @test('Reorder list')
  public async reorderListTest() {
    let result = await getReorderList();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(
      result.length,
      0,
      'Expected at least one product needing reorder'
    );
    validateRecordColumns(
      {
        recordType: 'reorder-list',
        functionName: 'getReorderList'
      },
      result[0],
      ['name', 'reorderlevel', 'unitsinstock', 'unitsonorder']
    );
  }
  @test('Recent Orders')
  public async recentOrdersTest() {
    let result = await getRecentOrders();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 5, 'Expected 5 orders');
    validateRecordColumns(
      {
        recordType: 'recent-orders',
        functionName: 'getRecentOrders'
      },
      result[0],
      ['customer', 'subtotal', 'employee']
    );
  }
}
