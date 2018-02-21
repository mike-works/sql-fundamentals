import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllCustomers, getCustomer } from '../src/data/customers';
import { getAllEmployees, getEmployee } from '../src/data/employees';
import { getAllOrders, getOrder } from '../src/data/orders';
import { getAllProducts, getProduct } from '../src/data/products';
import { getAllSuppliers, getSupplier } from '../src/data/suppliers';

import { validateRecordColumns } from './helpers/columns';
import './helpers/global-hooks';

const REQUIRED_EMPLOYEE_LIST_COLS = ['id', 'firstname', 'lastname'];
const REQUIRED_PRODUCT_LIST_COLS = ['id', 'supplierid', 'productname'];
const REQUIRED_ORDER_LIST_COLS = ['id', 'customerid', 'employeeid'];
const REQUIRED_SUPPLIER_LIST_COLS = ['id', 'companyname', 'contactname'];
const REQUIRED_CUSTOMER_LIST_COLS = REQUIRED_SUPPLIER_LIST_COLS;

const REQUIRED_EMPLOYEE_COLS = ['id', 'firstname', 'lastname'];
const REQUIRED_PRODUCT_COLS = ['id', 'supplierid', 'productname'];
const REQUIRED_ORDER_COLS = ['id', 'customerid', 'employeeid'];
const REQUIRED_SUPPLIER_COLS = ['id', 'companyname', 'contactname'];
const REQUIRED_CUSTOMER_COLS = REQUIRED_SUPPLIER_COLS;

@suite('EX00: Initial DB queries')
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
    assert.isAbove(
      result.length,
      20,
      'Expected more than 20 products in array'
    );
    validateRecordColumns(
      { recordType: 'product', functionName: 'getAllProducts' },
      result[3],
      REQUIRED_PRODUCT_LIST_COLS
    );
  }

  @test('Get products needing reorder')
  public async productsNeedingReorder() {
    let result = await getAllProducts({
      filter: { inventory: 'needs-reorder' }
    });
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 1, 'Expected more than 1 products in array');
    validateRecordColumns(
      {
        recordType: 'product',
        functionName: 'getAllProducts',
        functionArgs: [
          {
            filter: { inventory: 'needs-reorder' }
          }
        ]
      },
      result[0],
      REQUIRED_PRODUCT_LIST_COLS
    );
  }

  @test('Get discontinued products')
  public async discontinuedProducts() {
    let result = await getAllProducts({
      filter: { inventory: 'discontinued' }
    });
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(result.length, 1, 'Expected more than 1 product in array');
    validateRecordColumns(
      {
        recordType: 'product',
        functionName: 'getAllProducts',
        functionArgs: [
          {
            filter: { inventory: 'discontinued' }
          }
        ]
      },
      result[0],
      REQUIRED_PRODUCT_LIST_COLS
    );
  }

  @test('Get all orders')
  public async allOrders() {
    let result = await getAllOrders({ perPage: 50000 });
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(
      result.length,
      800,
      'Expected more than 800 orders in array'
    );
    validateRecordColumns(
      { recordType: 'order', functionName: 'getAllOrders' },
      result[2],
      REQUIRED_ORDER_LIST_COLS
    );
  }

  @test('Get all customers')
  public async allCustomers() {
    let result = await getAllCustomers();
    assert.isArray(result, 'Expected result to be an array');
    assert.isAbove(
      result.length,
      40,
      'Expected more than 40 customers in array'
    );
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
    assert.isAbove(
      result.length,
      20,
      'Expected more than 20 suppliers in array'
    );
    validateRecordColumns(
      { recordType: 'supplier', functionName: 'getAllSuppliers' },
      result[3],
      REQUIRED_SUPPLIER_LIST_COLS
    );
  }
  @test('Get one employee')
  public async getEmployee() {
    let result = await getEmployee(1);
    assert.isNotArray(result, 'Expected result NOT to be an array');
    validateRecordColumns(
      { recordType: 'employee', functionName: 'getEmployee(1)' },
      result,
      REQUIRED_EMPLOYEE_COLS
    );
  }

  @test('Get one order')
  public async getOrder() {
    let result = await getOrder(10705);
    assert.isNotArray(result, 'Expected result NOT to be an array');
    validateRecordColumns(
      { recordType: 'order', functionName: 'getOrder(10705)' },
      result,
      REQUIRED_ORDER_COLS
    );
  }

  @test('Get one product')
  public async getProduct() {
    let result = await getProduct(1);
    assert.isNotArray(result, 'Expected result NOT to be an array');
    validateRecordColumns(
      { recordType: 'product', functionName: 'getProduct(1)' },
      result,
      REQUIRED_PRODUCT_COLS
    );
  }

  @test('Get one supplier')
  public async getSupplier() {
    let result = await getSupplier(1);
    assert.isNotArray(result, 'Expected result NOT to be an array');
    validateRecordColumns(
      { recordType: 'supplier', functionName: 'getSupplier(1)' },
      result,
      REQUIRED_SUPPLIER_COLS
    );
  }

  @test('Get one customer')
  public async getCustomer() {
    let result = await getCustomer('CHOPS');
    assert.isNotArray(result, 'Expected result NOT to be an array');
    validateRecordColumns(
      { recordType: 'customer', functionName: 'getCustomer("CHOPS")' },
      result,
      REQUIRED_CUSTOMER_COLS
    );
  }
}
