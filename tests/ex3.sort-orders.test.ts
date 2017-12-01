import { assert } from 'chai';
import { sortBy } from 'lodash';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllOrders } from '../src/data/orders';

@suite('EX3: Order List Query - Sort tests')
class EmployeeDataTest {
  @test('By default, order list is sorted ascending by Id')
  public async orderListDefaults() {
    let firstPageResult = await getAllOrders({ perPage: 3 });
    let sortedById = sortBy(firstPageResult, 'Id');
    assert.deepEqual(firstPageResult, sortedById);
  }

  @test('using order="desc" (and specifying no column to sort on) sorts decending by Id')
  public async orderListDesc() {
    let firstPageResult = await getAllOrders({ perPage: 3, order: 'desc' });
    let sortedById = sortBy(firstPageResult, o => {
      let id: number = typeof o.Id === 'string' ? parseInt(o.Id, 10) : o.Id;
      return -1 * id;
    });
    assert.deepEqual(firstPageResult, sortedById);
  }
}
