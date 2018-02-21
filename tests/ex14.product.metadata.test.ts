import { assert } from 'chai';
import { suite, test, only } from 'mocha-typescript';
import { difference } from 'lodash';
import { getDb } from '../src/db/utils';
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct
} from '../src/data/products';

@suite('EX14: "Product Metadata" - JSONB column test')
class ProductMetadataJsonTest {
  // prettier-ignore
  protected productId!: string | number;
  public async before() {
    let { id } = await createProduct({
      productname: 'Red Bull',
      supplierid: -11,
      categoryid: 1,
      unitsinstock: 100,
      unitprice: 3.99,
      unitsonorder: 0,
      reorderlevel: 20,
      discontinued: 0,
      quantityperunit: '12 8oz cans'
    });
    this.productId = id;
  }

  public async after() {
    if (typeof this.productId === 'undefined') {
      return;
    }
    await deleteProduct(this.productId);
  }

  @test('getAllProducts results include a metadata column')
  public async metadataColumnExists() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.containsAllKeys(results[0], ['metadata']);
  }

  @test('metadata column is of type object')
  public async metadataIsObject() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.isObject(results[0].metadata);
  }

  @test(
    'newly created products begin with metadata { flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1} }'
  )
  public async newProductsStartEmpty() {
    assert.ok(this.productId, 'ID for new product is ok');
    let prod = await getProduct(this.productId);
    assert.ok(
      prod,
      "newly created product's id can be used to retreive it from the db"
    );

    assert.isObject(prod.metadata, 'metadata property is an object');
    assert.deepEqual(
      prod.metadata,
      { flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1 } },
      'metadata is initially { flavor: { salty: -1, sweet: -1, sour: -1, spicy: -1, bitter: -1} }'
    );
  }

  @test('updating product metadata persists successfully')
  public async metadataUpdatesPersist() {
    await updateProduct(this.productId, {
      metadata: { flavor: { spicy: 2, sweet: 0, salty: 5, sour: 1, bitter: 3 } }
    });
    let prod = await getProduct(this.productId);
    assert.isObject(prod.metadata, 'metadata property is an object');

    assert.deepEqual(
      prod.metadata,
      { flavor: { salty: 5, sweet: 0, sour: 1, spicy: 2, bitter: 3 } },
      'metadata changes alter the database record'
    );
  }

  @test('getAllProducts with flavor filter: sweet>2 sour>2')
  public async sweetSourFilter() {
    let allResults = await getAllProducts();
    let sweetSourResults = await getAllProducts({
      filter: {
        flavor: [
          { flavorName: 'sour', type: 'greater-than', level: 2 },
          { flavorName: 'sweet', type: 'greater-than', level: 2 }
        ]
      }
    });
    assert.isBelow(
      sweetSourResults.length,
      allResults.length,
      'Sweet-sour products are a subset of all products'
    );
    assert.ok(
      sweetSourResults.every(
        p => p.metadata.flavor.sweet > 2 && p.metadata.flavor.sour > 2
      ),
      'All results from sweet-sour filter have sweet > 2 and sour > 2'
    );
    assert.ok(
      difference(allResults, sweetSourResults).every(
        p => p.metadata.flavor.sweet <= 2 || p.metadata.flavor.sour <= 2
      ),
      'All results excluded by sweet-sour filter have sweet <= 2 OR sour <= 2'
    );
  }

  @test('getAllProducts with flavor filter: sweet>2 spicy>2')
  public async sweetHotFilter() {
    let allResults = await getAllProducts();
    let sweetHotResults = await getAllProducts({
      filter: {
        flavor: [
          { flavorName: 'spicy', type: 'greater-than', level: 2 },
          { flavorName: 'sweet', type: 'greater-than', level: 2 }
        ]
      }
    });
    assert.isBelow(
      sweetHotResults.length,
      allResults.length,
      'Sweet-hot products are a subset of all products'
    );
    assert.ok(
      sweetHotResults.every(
        p => p.metadata.flavor.sweet > 2 && p.metadata.flavor.spicy > 2
      ),
      'All results from sweet-hot filter have sweet > 2 and spicy > 2'
    );
    assert.ok(
      difference(allResults, sweetHotResults).every(
        p => p.metadata.flavor.sweet <= 2 || p.metadata.flavor.spicy <= 2
      ),
      'All results excluded by sweet-hot filter have sweet <= 2 OR spicy <= 2'
    );
  }
}
