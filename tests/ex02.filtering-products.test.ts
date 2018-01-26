import { assert } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllProducts, getDiscontinuedProducts, getProductsNeedingReorder } from '../src/data/products';

function assertProductCols(item: any) {
  assert.containsAllKeys(
    item,
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
    ], // tslint:disable-next-line:max-line-length
    'each DB result has properties Id,CategoryId,Discontinued,ProductName,QuantityPerUnit,ReorderLevel,SupplierId,UnitPrice,UnitsInStock,UnitsOnOrder'
  );
}

@suite('EX2: Filtering Products')
class EmployeeDataTest {
  @test('getAllProducts() (no filter) still works as expected')
  public async allProducts() {
    let result = await getAllProducts();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 77, 'Expected 77 products in array');
    assertProductCols(result[0]);
  }

  @test('getDiscontinuedProducts() only returns discontinued items')
  public async discontinuedProducts() {
    let result = await getDiscontinuedProducts();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 8, 'Expected 8 products in array');
    assertProductCols(result[0]);
    let numDiscontinued = result.filter(r => r.Discontinued).length;
    assert.equal(numDiscontinued, result.length, 'All items in result set are discontinued');
  }

  @test('getProductsNeedingReorder() only products that need to be reordered')
  public async productsNeedingReorder() {
    let result = await getProductsNeedingReorder();
    assert.isArray(result, 'Expected result to be an array');
    assert.equal(result.length, 2, 'Expected 2 products in array');
    assertProductCols(result[0]);

    let numNeedingReorder = result.filter(r => r.UnitsInStock + r.UnitsOnOrder < r.ReorderLevel).length;

    assert.equal(
      numNeedingReorder,
      result.length,
      'All items in result set have UnitsInStock+UnitsOnOrder less than ReorderLevel'
    );
  }
}
