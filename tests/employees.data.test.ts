import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllEmployees } from '../src/data/employees';

@suite('BEGIN: Employee DB queries')
class EmployeeDataTest {
  @test('Get all employees')
  public async allEmployees() {
    let result = await getAllEmployees();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 9, 'Expected 9 employees in array');
    assert.containsAllKeys(
      result[3],
      ['Id', 'FirstName', 'LastName'],
      'result[3] has properties Id, FirstName and LastName'
    );
  }
}
