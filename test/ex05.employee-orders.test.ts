import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX05: "Employee Order Count" - Aggregate Function Tests')
class EmployeeOrderCountTest {
  @test('getAllEmployees() results must now include OrderCount')
  public async orderCountIsPresent() {
    let [result] = await getAllEmployees();
    assert.containsAllKeys(result, ['ordercount']);
  }

  @test('getAllEmployees() ordercount must be the correct value')
  public async orderCountIsCorrect() {
    let [employee] = await getAllEmployees();
    let allOrders = await getAllOrders({ page: 1, perPage: 999999 });
    let orderCt = allOrders.filter(o => o.employeeid === employee.id).length;
    assert.ok(employee.ordercount);
    assert.equal(employee.ordercount, orderCt);
  }
}
