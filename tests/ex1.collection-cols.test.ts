import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';
import { getAllProducts } from '../src/data/products';

@suite('EX1: Collection Queries - Ask for specific columns')
class EmployeeDataTest {
  @test('All employees')
  public async allEmployees() {
    let result = await getAllEmployees();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 9, 'Expected 9 employees in array');
    assert.containsAllKeys(
      result[3],
      ['Id', 'FirstName', 'LastName', 'HireDate', 'Region', 'Title'],
      'each DB result has properties Id, FirstName, LastName, HireDate, Region and Title'
    );
  }

  @test('All orders')
  public async allOrders() {
    let result = await getAllOrders({ perPage: 50000 });
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 16818, 'Expected 16818 orders in array');
    assert.containsAllKeys(
      result[3],
      ['Id', 'ShipCity', 'ShipCountry', 'EmployeeId', 'CustomerId'],
      'each DB result has properties Id, ShipCity, ShipCountry, EmployeeId, CustomerId'
    );
  }

  @test('All products')
  public async allProducts() {
    let result = await getAllProducts();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 77, 'Expected 77 products in array');
    assert.hasAllKeys(
      result[3],
      [
        'Id',
        'CategoryId',
        'Discontinued',
        'ProductName',
        'QuantityPerUnit',
        'ReorderLevel',
        'SupplierId',
        'UnitPrice',
        'UnitsInStock',
        'UnitsOnOrder'
      ],
      // tslint:disable-next-line:max-line-length
      'each DB result has properties Id,CategoryId,Discontinued,ProductName,QuantityPerUnit,ReorderLevel,SupplierId,UnitPrice,UnitsInStock,UnitsOnOrder'
    );
  }
}
