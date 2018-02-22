import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';

import { getAllProducts } from '../src/data/products';

import './helpers/global-hooks';

function assertProductCols(item: any) {
  assert.containsAllKeys(
    item,
    [
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
    ], // tslint:disable-next-line:max-line-length
    'each DB result has properties id, categoryid, discontinued, productname, quantityperunit, reorderlevel, supplierid, unitprice, unitsinstock, unitsonorder'
  );
}

@suite('EX02: Filtering Products')
class EmployeeDataTest {
  @test('getAllProducts() (no filter) still works as expected')
  public async allProducts() {
    let result = await getAllProducts();
    assert.isArray(result, 'Expected result to be an array');
    // TODO: tighten assertion
    assert.isAtLeast(
      result.length,
      50,
      'Expected at least 50 products in array'
    );
    assertProductCols(result[0]);
  }

  @test(
    'getAllProducts({ filter: { inventory: "discontinued" } }) only returns discontinued items'
  )
  public async discontinuedProducts() {
    let result = await getAllProducts({
      filter: { inventory: 'discontinued' }
    });
    assert.isArray(result, 'Expected result to be an array');
    // TODO: tighten assertion
    assert.isAtLeast(result.length, 5, 'Expected at least 5 products in array');
    assertProductCols(result[0]);
    let numDiscontinued = result.filter(r => r.discontinued).length;
    assert.equal(
      numDiscontinued,
      result.length,
      'All items in result set are discontinued'
    );
  }

  @test(
    'getAllProducts({ filter: { inventory: "needs-reorder" } }) only products that need to be reordered'
  )
  public async productsNeedingReorder() {
    let result = await getAllProducts({
      filter: { inventory: 'needs-reorder' }
    });
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 2, 'Expected 2 products in array');
    assertProductCols(result[0]);

    let numNeedingReorder = result.filter(
      r => r.unitsinstock + r.unitsonorder < r.reorderlevel
    ).length;

    assert.equal(
      numNeedingReorder,
      result.length,
      'All items in result set have unitsinstock + unitsonorder less than reorderlevel'
    );
  }
}
