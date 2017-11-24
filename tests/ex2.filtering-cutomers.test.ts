import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllCustomers } from '../src/data/customers';

@suite('EX2: Filtering Customers')
class EmployeeDataTest {
  @test('Unfiltered query still behaves as expected')
  public async allCustomers() {
    let result = await getAllCustomers();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 91, 'Expected 91 customers in array');
    assert.hasAllKeys(
      result[3],
      ['Id', 'ContactName', 'CompanyName'],
      'each DB result has properties Id, ContactName and CompanyName'
    );
  }
  @test('filter="fre" returns subset of results')
  public async filteredCustomers1() {
    let result = await getAllCustomers({ filter: 'fre' });
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 3, 'Expected 3 customers in array');
    assert.hasAllKeys(
      result[1],
      ['Id', 'ContactName', 'CompanyName'],
      'each DB result has properties Id, ContactName and CompanyName'
    );
  }

  @test('filter="mo" returns subset of results')
  public async filteredCustomers2() {
    let result = await getAllCustomers({ filter: 'mo' });
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 12, 'Expected 12 customers in array');
    assert.hasAllKeys(
      result[1],
      ['Id', 'ContactName', 'CompanyName'],
      'each DB result has properties Id, ContactName and CompanyName'
    );
  }
}
