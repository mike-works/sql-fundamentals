import { assert } from 'chai';
import { orderBy } from 'lodash';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { getAllProducts, getDiscontinuedProducts, getProductsNeedingReorder } from '../src/data/products';
import { logger } from '../src/log';

@suite('EX4: "Products List" Query - Join tests')
class ProductsListJoinTest {
  @test('getAllProducts() results must now include CategoryName and SupplierName columns')
  public async allProductsColumnTest() {
    let firstPageResult = await getAllProducts();
    assert.containsAllKeys(firstPageResult[0], ['SupplierName', 'CategoryName']);
    assert.ok((firstPageResult[0] as any).SupplierName);
    assert.ok((firstPageResult[0] as any).CategoryName);
  }
  @test('getDiscontinuedProducts() results must now include CategoryName and SupplierName columns')
  public async discontinuedProductsColumnTest() {
    let firstPageResult = await getDiscontinuedProducts();
    assert.containsAllKeys(firstPageResult[0], ['SupplierName', 'CategoryName']);
    assert.ok((firstPageResult[0] as any).SupplierName);
    assert.ok((firstPageResult[0] as any).CategoryName);
  }
  @test('getProductsNeedingReorder() results must now include CategoryName and SupplierName columns')
  public async reorderableProductsColumnTest() {
    let firstPageResult = await getProductsNeedingReorder();
    assert.containsAllKeys(firstPageResult[0], ['SupplierName', 'CategoryName']);
    assert.ok((firstPageResult[0] as any).SupplierName);
    assert.ok((firstPageResult[0] as any).CategoryName);
  }
}
