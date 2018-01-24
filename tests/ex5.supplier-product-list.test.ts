import { assert } from 'chai';
import { orderBy } from 'lodash';
import { suite, test } from 'mocha-typescript';
import { getAllProducts } from '../src/data/products';
import { getAllSuppliers } from '../src/data/suppliers';
import { logger } from '../src/log';

@suite('EX5: "Supplier Product List" - Aggregate Function Tests')
class SupplierProductListTest {
  @test('getAllSuppliers() results must now include ProductList')
  public async productListIsPresent() {
    let [supplierResult] = await getAllSuppliers();
    assert.containsAllKeys(supplierResult, ['ProductList']);
  }

  @test('getAllSuppliers() ProductList must be the correct value')
  public async productListIsCorrect() {
    let [supplierResult] = await getAllSuppliers();
    let allProducts = await getAllProducts();
    let productsString = allProducts
      .filter(p => p.SupplierId === supplierResult.Id)
      .map(p => p.ProductName)
      .join(', ');

    assert.equal(supplierResult.ProductList, productsString);
  }
}
