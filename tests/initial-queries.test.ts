import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllCustomers } from '../src/data/customers';
import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';
import { getAllProducts } from '../src/data/products';
import { getAllSuppliers } from '../src/data/suppliers';
import { validateRecordColumns } from './helpers';

const REQUIRED_EMPLOYEE_LIST_COLS = ['Id', 'FirstName', 'LastName'];
const REQUIRED_PRODUCT_LIST_COLS = ['Id', 'SupplierId', 'ProductName'];
const REQUIRED_ORDER_LIST_COLS = ['Id', 'CustomerId', 'EmployeeId'];
const REQUIRED_SUPPLIER_LIST_COLS = ['Id', 'CompanyName', 'ContactName'];
const REQUIRED_CUSTOMER_LIST_COLS = REQUIRED_SUPPLIER_LIST_COLS;

@suite('BEGIN: Initial DB queries')
class InitialListQueriesTest {
  @test('Get all employees')
  public async allEmployees() {
    let result = await getAllEmployees();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 5, 'Expected more than 5 employees in array');
    validateRecordColumns(
      { recordType: 'employee', functionName: 'getAllEmployees' },
      result[3],
      REQUIRED_EMPLOYEE_LIST_COLS
    );
  }

  @test('Get all products')
  public async allProducts() {
    let result = await getAllProducts();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 20, 'Expected more than 20 products in array');
    validateRecordColumns(
      { recordType: 'product', functionName: 'getAllProducts' },
      result[3],
      REQUIRED_PRODUCT_LIST_COLS
    );
  }

  @test('Get all orders')
  public async allOrders() {
    let result = await getAllOrders({ perPage: 50000 });
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 16000, 'Expected more than 16000 orders in array');
    validateRecordColumns({ recordType: 'order', functionName: 'getAllOrders' }, result[2], REQUIRED_ORDER_LIST_COLS);
  }

  @test('Get all customers')
  public async allCustomers() {
    let result = await getAllCustomers();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 40, 'Expected more than 40 customers in array');
    validateRecordColumns(
      { recordType: 'customer', functionName: 'getAllCustomers' },
      result[2],
      REQUIRED_CUSTOMER_LIST_COLS
    );
  }

  @test('Get all suppliers')
  public async allSuppliers() {
    let result = await getAllSuppliers();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 20, 'Expected more than 20 suppliers in array');
    validateRecordColumns(
      { recordType: 'supplier', functionName: 'getAllSuppliers' },
      result[3],
      REQUIRED_SUPPLIER_LIST_COLS
    );
  }
}
