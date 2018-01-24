import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';
import { logger } from '../src/log';

@suite('EX5: "Employee Order Count" - Aggregate Function Tests')
class EmployeeOrderCountTest {
  @test('getAllEmployees() results must now include OrderCount')
  public async orderCountIsPresent() {
    let [result] = await getAllEmployees();
    assert.containsAllKeys(result, ['OrderCount']);
  }

  @test('getAllEmployees() OrderCount must be the correct value')
  public async orderCountIsCorrect() {
    let [employee] = await getAllEmployees();
    let allOrders = await getAllOrders({ page: 1, perPage: 999999 });
    let orderCt = allOrders
      .filter(o => o.EmployeeId === employee.Id)
      .length;
    console.log('orderCt= ', orderCt);
    assert.ok(employee.OrderCount);
    assert.equal(employee.OrderCount, orderCt);
  }
}
