import { assert } from 'chai';
import { difference } from 'lodash';
import { suite } from 'mocha-typescript';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../src/data/products';
import { getDb, DbType } from '../src/db/utils';

import { onlyForDatabaseTypes } from './helpers/decorators';
import './helpers/global-hooks';

@suite('EX16: "Product Tags" - Array column test')
class ProductTagsTest {
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

  @test('getAllProducts results include a tags column')
  public async tagsColumnExists() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.containsAllKeys(results[0], ['tags']);
  }

  @test('tags column is of type array')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async tagsIsArray() {
    let db = await getDb();
    let results = await getAllProducts();
    assert.isArray(results[0].tags);
  }

  @test('newly created products begin with an empty tags array')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async newProductsStartEmpty() {
    assert.ok(this.productId, 'ID for new product is ok');
    let prod = await getProduct(this.productId);
    assert.ok(prod, "newly created product's id can be used to retreive it from the db");

    assert.isArray(prod.tags, 'tags property is an array');
    assert.equal(prod.tags.length, 0, 'tags array is empty');
  }

  @test('updating product tags persists successfully')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async tagUpdatesPersist() {
    await updateProduct(this.productId, { tags: ['foo', 'bar'] });
    let prod = await getProduct(this.productId);

    assert.isArray(prod.tags, 'tags property is an array');
    assert.equal(prod.tags.length, 2, 'tags has length 2');
  }

  @test('getAllProducts with tag filter')
  @onlyForDatabaseTypes(DbType.PostgreSQL, DbType.MySQL)
  public async tagFilter() {
    let allResults = await getAllProducts();
    let filteredResults = await getAllProducts({
      filter: {
        requiredTags: ['foo']
      }
    });
    assert.isBelow(
      filteredResults.length,
      allResults.length,
      'filtered products are a subset of all products'
    );
    assert.ok(
      filteredResults.every(p => p.tags.indexOf('foo') >= 0),
      'All results from tag filter have "foo" tag'
    );
    assert.ok(
      difference(allResults, filteredResults).every(p => (p.tags || []).indexOf('foo') < 0),
      'All results excluded by tag filter are missing tag'
    );
  }
}
