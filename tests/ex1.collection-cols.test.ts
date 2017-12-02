import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';
import { getAllProducts } from '../src/data/products';
import { validateRecordColumns } from './helpers';

const REQUIRED_EMPLOYEE_LIST_COLS = ['Id', 'FirstName', 'LastName', 'HireDate', 'Region', 'Title', 'ReportsTo'];
const FORBIDDEN_EMPLOYEE_LIST_COLS = ['TitleOfCourtesy', 'Extension', 'Photo', 'PhotoPath'];

const REQUIRED_ORDER_LIST_COLS = ['Id', 'ShipCity', 'ShipCountry', 'EmployeeId', 'CustomerId'];
const FORBIDDEN_ORDER_LIST_COLS = ['ShipAddress'];

const REQUIRED_PRODUCT_LIST_COLS = [
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
];
const FORBIDDEN_PRODUCT_LIST_COLS: string[] = [];

@suite('EX1: Collection Queries - Ask for specific columns')
class EmployeeDataTest {
  @test('All employees')
  public async allEmployees() {
    let result = await getAllEmployees();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 9, 'Expected 9 employees in array');
    validateRecordColumns(
      { recordType: 'employee', functionName: 'getAllEmployees' },
      result[3],
      REQUIRED_EMPLOYEE_LIST_COLS,
      FORBIDDEN_EMPLOYEE_LIST_COLS
    );
  }

  @test('All orders')
  public async allOrders() {
    let result = await getAllOrders({ perPage: 50000 });
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 16818, 'Expected 16818 orders in array');
    validateRecordColumns(
      { recordType: 'order', functionName: 'getAllOrders' },
      result[3],
      REQUIRED_ORDER_LIST_COLS,
      FORBIDDEN_ORDER_LIST_COLS
    );
  }

  @test('All products')
  public async allProducts() {
    let result = await getAllProducts();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 77, 'Expected 77 products in array');
    validateRecordColumns(
      { recordType: 'product', functionName: 'getAllProducts' },
      result[3],
      REQUIRED_PRODUCT_LIST_COLS,
      FORBIDDEN_PRODUCT_LIST_COLS
    );
  }
}
