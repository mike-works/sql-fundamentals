import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllCustomers } from '../src/data/customers';
import { validateRecordColumns } from './test-helpers';

const ALL_CUSTOMERS_REQUIRED_COLS = ['id', 'contactname', 'companyname'];

@suite('EX002: Filtering Customers')
class EmployeeDataTest {
  @test('Unfiltered query still behaves as expected')
  public async allCustomers() {
    let result = await getAllCustomers();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 91, 'Expected 91 customers in array');
    validateRecordColumns(
      { recordType: 'customer', functionName: 'getAllCustomers' },
      result[3],
      ALL_CUSTOMERS_REQUIRED_COLS,
      []
    );
  }
  @test('filter="fre" returns subset of results')
  public async filteredCustomers1() {
    let result = await getAllCustomers({ filter: 'fre' });
    assert.isArray(result, 'Expected result to be an array');
    assert.isAtMost(result.length, 3, 'Expected 3 or fewer customers in array');
    validateRecordColumns(
      {
        recordType: 'customer',
        functionName: 'getAllCustomers({ filter: "fre" })'
      },
      result[0],
      ALL_CUSTOMERS_REQUIRED_COLS,
      []
    );
  }

  @test('filter="mo" returns subset of results')
  public async filteredCustomers2() {
    let result = await getAllCustomers({ filter: 'mo' });
    assert.isArray(result, 'Expected result to be an array');
    assert.isAtMost(
      result.length,
      12,
      'Expected 12 or fewer customers in array'
    );
    validateRecordColumns(
      {
        recordType: 'customer',
        functionName: 'getAllCustomers({ filter: "mo" })'
      },
      result[1],
      ALL_CUSTOMERS_REQUIRED_COLS,
      []
    );
  }
}
