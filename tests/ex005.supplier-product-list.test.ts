import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { getAllProducts } from '../src/data/products';
import { getAllSuppliers } from '../src/data/suppliers';
import { logger } from '../src/log';

@suite('EX005: "Supplier Product List" - Aggregate Function Tests')
class SupplierProductListTest {
  @test('getAllSuppliers() results must now include productlist')
  public async productListIsPresent() {
    let [supplierResult] = await getAllSuppliers();
    assert.containsAllKeys(supplierResult, ['productlist']);
  }

  @test('getAllSuppliers() productlist must be the correct value')
  public async productListIsCorrect() {
    let [supplierResult] = await getAllSuppliers();
    let allProducts = await getAllProducts();
    let productsString = allProducts
      .filter(p => p.supplierid === supplierResult.id)
      .map(p => p.productname)
      .sort()
      .join(', ');

    assert.equal(supplierResult.productlist, productsString);
  }
}
