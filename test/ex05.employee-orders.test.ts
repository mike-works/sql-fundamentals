import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';

import './helpers/global-hooks';

@suite('EX05: "Employee Num Orders" - Aggregate Function Tests')
class EmployeeNumOrdersTest {
  @test('getAllEmployees() results must now include numorders')
  public async orderCountIsPresent() {
    let [result] = await getAllEmployees();
    assert.containsAllKeys(result, ['numorders']);
  }

  @test.skip //('getAllEmployees() numorders must be the correct value')
  public async orderCountIsCorrect() {
    let [employee] = await getAllEmployees();
    let allOrders = await getAllOrders({ page: 1, perPage: 999999 });
    let orderCt = allOrders.filter(o => o.employeeid === employee.id).length;
    assert.ok(employee.numorders);
    assert.equal(employee.numorders, orderCt);
  }
}

switch (process.env.DB_TYPE) {
  case 'mysql' /*...*/:
    break;
  case 'pg' /*...*/:
    break;
  case 'sqlite':
  default:
    /*...*/
    break;
}
