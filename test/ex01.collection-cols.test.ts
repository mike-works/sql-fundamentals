import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllEmployees } from '../src/data/employees';
import { getAllOrders } from '../src/data/orders';
import { getAllProducts } from '../src/data/products';

import { getAllCustomers } from '../src/data/customers';
import { getAllSuppliers } from '../src/data/suppliers';
import { validateRecordColumns } from './helpers/columns';
import './helpers/global-hooks';

const REQUIRED_EMPLOYEE_LIST_COLS = [
  'id',
  'firstname',
  'lastname',
  'hiredate',
  'region',
  'title',
  'reportsto'
];
const FORBIDDEN_EMPLOYEE_LIST_COLS = ['titleofcourtesy', 'extension', 'photo', 'photopath'];

const REQUIRED_ORDER_LIST_COLS = ['id', 'shipcity', 'shipcountry', 'employeeid', 'customerid'];
const FORBIDDEN_ORDER_LIST_COLS = ['shipaddress'];

const REQUIRED_SUPPLIER_LIST_COLS = ['id', 'contactname', 'companyname'];
const FORBIDDEN_SUPPLIER_LIST_COLS = ['homepage'];

const REQUIRED_CUSTOMER_LIST_COLS = ['id', 'contactname', 'companyname'];
const FORBIDDEN_CUSTOMER_LIST_COLS = ['fax'];

const REQUIRED_PRODUCT_LIST_COLS = [
  'id',
  'categoryid',
  'discontinued',
  'productname',
  'quantityperunit',
  'reorderlevel',
  'supplierid',
  'unitprice',
  'unitsinstock',
  'unitsonorder'
];
const FORBIDDEN_PRODUCT_LIST_COLS: string[] = [];

@suite('EX01: Collection Queries - Ask for specific columns')
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
    assert.isAbove(result.length, 9000, 'Expected over 9000 orders in array');
    validateRecordColumns(
      { recordType: 'order', functionName: 'getAllOrders' },
      result[3],
      REQUIRED_ORDER_LIST_COLS,
      FORBIDDEN_ORDER_LIST_COLS
    );
  }

  @test('All suppliers')
  public async allSuppliers() {
    let result = await getAllSuppliers();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 20, 'Expected over 20 suppliers in array');
    validateRecordColumns(
      { recordType: 'supplier', functionName: 'getAllSuppliers' },
      result[3],
      REQUIRED_SUPPLIER_LIST_COLS,
      FORBIDDEN_SUPPLIER_LIST_COLS
    );
  }

  @test('All customers')
  public async allCustomers() {
    let result = await getAllCustomers();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 20, 'Expected over 20 customers in array');
    validateRecordColumns(
      { recordType: 'customer', functionName: 'getAllCustomers' },
      result[3],
      REQUIRED_CUSTOMER_LIST_COLS,
      FORBIDDEN_CUSTOMER_LIST_COLS
    );
  }

  @test('All products')
  public async allProducts() {
    let result = await getAllProducts();
    assert.isArray(result, 'Expected result to be an array');
    // TODO: tighten assertion
    assert.isAtLeast(result.length, 50, 'Expected at least 50 products in array');
    validateRecordColumns(
      { recordType: 'product', functionName: 'getAllProducts' },
      result[3],
      REQUIRED_PRODUCT_LIST_COLS,
      FORBIDDEN_PRODUCT_LIST_COLS
    );
  }
}
